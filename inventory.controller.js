const Product = require('../models/product.model');

// Constantes para mensajes y configuraciones
const ERROR_MESSAGES = {
    SERVER_ERROR: 'Error en el servidor',
    NOT_FOUND: 'Producto no encontrado',
    UNAUTHORIZED: 'No autorizado',
    INVALID_DATA: 'Datos inválidos',
    BARCODE_EXISTS: 'El código de barras ya está en uso'
};

const DEFAULT_VALUES = {
    UNIT: 'pieza',
    MIN_STOCK: 5,
    HAS_IVA: true
};

const inventoryController = {
    /**
     * Obtiene todos los productos
     */
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.getAll();
            res.json(products);
        } catch (error) {
            //handleServerError(res, 'Error al obtener productos:', error);
            console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error en el servidor' });
        }
    },

    /**
     * Obtiene un producto por ID
     */
    getProductById: async (req, res) => {
        try {
            const product = await getProductOrFail(req.params.id, res);
            if (product) res.json(product);
        } catch (error) {
            handleServerError(res, 'Error al obtener producto:', error);
        }
    },

    /**
     * Obtiene un producto por código de barras
     */
    getProductByBarcode: async (req, res) => {
        try {
            const { barcode } = req.params;
            const product = await Product.getByBarcode(barcode);
            
            if (!product) {
                return res.status(404).json({ error: ERROR_MESSAGES.NOT_FOUND });
            }
            
            res.json(product);
        } catch (error) {
            handleServerError(res, 'Error al obtener producto por código de barras:', error);
        }
    },

    /**
     * Crea un nuevo producto (solo administrador)
     */
    createProduct: async (req, res) => {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
        }
        
        try {
            const { nombre, descripcion, precio, stock, codigo_barras, id_proveedor } = req.body;
            
            // Validación de campos
            const validationError = validateProductFields({ nombre, precio, stock, codigo_barras });
            if (validationError) return res.status(400).json({ error: validationError });
            
            // Verificar código de barras único
            if (await Product.getByBarcode(codigo_barras)) {
                return res.status(400).json({ error: ERROR_MESSAGES.BARCODE_EXISTS });
            }
            
            // Crear producto
            const productId = await Product.create({
                nombre,
                descripcion: descripcion || null,
                precio,
                stock,
                codigo_barras,
                id_proveedor: id_proveedor || null,
                estado: 'activo',
                fecha_desactivacion: null
            });
            
            res.status(201).json({ 
                id: productId, 
                message: 'Producto creado exitosamente' 
            });
        } catch (error) {
            handleServerError(res, 'Error al crear producto:', error);
        }
    },

    /**
     * Actualiza un producto existente (solo administrador)
     */
    updateProduct: async (req, res) => {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
        }
        
        try {
            const { id } = req.params;
            const existingProduct = await getProductOrFail(id, res);
            if (!existingProduct) return;
            
            // Validar campos actualizados
            const { precio, stock, codigo_barras } = req.body;
            const validationError = validateUpdatedFields({ precio, stock });
            if (validationError) return res.status(400).json({ error: validationError });
            
            // Verificar código de barras único si se cambia
            if (codigo_barras && codigo_barras !== existingProduct.codigo_barras) {
                if (await Product.getByBarcode(codigo_barras)) {
                    return res.status(400).json({ error: ERROR_MESSAGES.BARCODE_EXISTS });
                }
            }
            
            // Preparar datos para actualización
            const updateData = prepareUpdateData(req.body, existingProduct);
            
            // Actualizar producto
            await Product.update(id, updateData);
            
            res.json({ message: 'Producto actualizado exitosamente' });
        } catch (error) {
            handleServerError(res, 'Error al actualizar producto:', error);
        }
    },

    /**
     * Desactiva un producto (solo administrador)
     */
    deactivateProduct: async (req, res) => {
        if (!isAdmin(req.user)) {
            return res.status(403).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
        }
        
        try {
            const { id } = req.params;
            const product = await getProductOrFail(id, res);
            if (!product) return;
            
            await Product.update(id, {
                estado: 'inactivo',
                fecha_desactivacion: new Date()
            });
            
            res.json({ message: 'Producto desactivado exitosamente' });
        } catch (error) {
            handleServerError(res, 'Error al desactivar producto:', error);
        }
    },

    /**
     * Obtiene productos con bajo stock
     */
    checkLowStock: async (req, res) => {
        try {
            const lowStockProducts = await Product.getLowStock();
            res.json(lowStockProducts);
        } catch (error) {
            handleServerError(res, 'Error al verificar stock bajo:', error);
        }
    }
};

// Funciones auxiliares
function isAdmin(user) {
    return user.nombre_rol === 'administrador';
}


async function getProductOrFail(id, res) {
    const product = await Product.getById(id);
    if (!product) {
        res.status(404).json({ error: ERROR_MESSAGES.NOT_FOUND });
        return null;
    }
    return product;
}

function validateProductFields({ nombre, precio, stock, codigo_barras }) {
    if (!nombre || !precio || !stock || !codigo_barras) {
        return 'Nombre, precio, stock y código de barras son requeridos';
    }
    if (isNaN(precio) || precio <= 0 || isNaN(stock) || stock < 0) {
        return 'Precio y stock deben ser números válidos';
    }
    return null;
}

function validateUpdatedFields({ precio, stock }) {
    if (precio && (isNaN(precio) || precio <= 0)) {
        return 'Precio debe ser un número válido';
    }
    if (stock && (isNaN(stock) || stock < 0)) {
        return 'Stock debe ser un número válido';
    }
    return null;
}

function prepareUpdateData(newData, existingProduct) {
    return {
    nombre: newData.nombre || existingProduct.nombre,
    descripcion: newData.descripcion || existingProduct.descripcion,
    precio: newData.precio || existingProduct.precio,
    stock: newData.stock || existingProduct.stock,
    codigo_barras: newData.codigo_barras || existingProduct.codigo_barras,
    id_proveedor: newData.id_proveedor || existingProduct.id_proveedor,
    estado: newData.estado || existingProduct.estado  
};

}

function handleServerError(res, logMessage, error) {
    console.error(logMessage, error);
    res.status(500).json({ error: ERROR_MESSAGES.SERVER_ERROR });
}

module.exports = inventoryController;
