// Servicio para guardar/recuperar datos del localStorage

export const storageService = {
  // ==================== AUTENTICACIÓN ====================

  // Usuarios registrados
  getUsuarios: () => {
    const data = localStorage.getItem('usuarios');
    if (!data) {
      // Usuarios por defecto
      const usuariosDefecto = [
        {
          id: '1',
          email: 'test@example.com',
          password: '123456',
          nombre: 'Juan García',
          rif: 'V-12345678',
          empresa: 'Mi Empresa',
          logo: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        },
        {
          id: '2',
          email: 'admin@example.com',
          password: 'admin123',
          nombre: 'Administrador',
          rif: 'V-87654321',
          empresa: 'Admin Corp',
          logo: 'https://ionicframework.com/docs/img/demos/avatar.svg',
        },
      ];
      storageService.guardarUsuarios(usuariosDefecto);
      return usuariosDefecto;
    }
    return JSON.parse(data);
  },

  guardarUsuarios: (usuarios: any[]) => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  },

  // Login
  login: (email: string, password: string) => {
    const usuarios = storageService.getUsuarios();
    const usuario = usuarios.find((u: any) => u.email === email && u.password === password);

    if (usuario) {
      const { password, ...usuarioSinPassword } = usuario;
      return usuarioSinPassword;
    }

    throw new Error('Credenciales inválidas');
  },

  // Registrar nuevo usuario
  registrarUsuario: (datos: any) => {
    const usuarios = storageService.getUsuarios();

    // Verificar si el email ya existe
    if (usuarios.some((u: any) => u.email === datos.email)) {
      throw new Error('El email ya está registrado');
    }

    const nuevoUsuario = {
      id: Date.now().toString(),
      email: datos.email,
      password: datos.password,
      nombre: datos.nombre,
      rif: datos.rif,
      empresa: datos.empresa || '',
      logo: datos.logo || 'https://ionicframework.com/docs/img/demos/avatar.svg',
    };

    usuarios.push(nuevoUsuario);
    storageService.guardarUsuarios(usuarios);

    const { password, ...usuarioSinPassword } = nuevoUsuario;
    return usuarioSinPassword;
  },

  // Actualizar perfil de usuario
  actualizarUsuario: (userId: string, datos: any) => {
    let usuarios = storageService.getUsuarios();
    usuarios = usuarios.map((u: any) =>
      u.id === userId ? { ...u, ...datos } : u
    );
    storageService.guardarUsuarios(usuarios);
  },

  // Cambiar contraseña
  cambiarPassword: (email: string, passwordActual: string, passwordNueva: string) => {
    const usuarios = storageService.getUsuarios();
    const usuario = usuarios.find((u: any) => u.email === email);

    if (!usuario || usuario.password !== passwordActual) {
      throw new Error('Contraseña actual incorrecta');
    }

    usuario.password = passwordNueva;
    storageService.guardarUsuarios(usuarios);
  },

  // ==================== CLIENTES ====================

  getClientes: () => {
    const data = localStorage.getItem('clientes');
    return data ? JSON.parse(data) : [];
  },

  guardarClientes: (clientes: any[]) => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  },

  agregarCliente: (cliente: any) => {
    const clientes = storageService.getClientes();
    cliente.id = Date.now().toString();
    cliente.fechaCreacion = new Date().toISOString();
    clientes.push(cliente);
    storageService.guardarClientes(clientes);
    return cliente;
  },

  editarCliente: (id: string, clienteActualizado: any) => {
    let clientes = storageService.getClientes();
    clientes = clientes.map((c: any) => c.id === id ? { ...c, ...clienteActualizado } : c);
    storageService.guardarClientes(clientes);
  },

  eliminarCliente: (id: string) => {
    let clientes = storageService.getClientes();
    clientes = clientes.filter((c: any) => c.id !== id);
    storageService.guardarClientes(clientes);
  },

  getClienteById: (id: string) => {
    const clientes = storageService.getClientes();
    return clientes.find((c: any) => c.id === id);
  },

  // ==================== PRODUCTOS ====================

  getProductos: () => {
    const data = localStorage.getItem('productos');
    return data ? JSON.parse(data) : [];
  },

  guardarProductos: (productos: any[]) => {
    localStorage.setItem('productos', JSON.stringify(productos));
  },

  agregarProducto: (producto: any) => {
    const productos = storageService.getProductos();
    producto.id = Date.now().toString();
    producto.fechaCreacion = new Date().toISOString();
    productos.push(producto);
    storageService.guardarProductos(productos);
    return producto;
  },

  editarProducto: (id: string, productoActualizado: any) => {
    let productos = storageService.getProductos();
    productos = productos.map((p: any) => p.id === id ? { ...p, ...productoActualizado } : p);
    storageService.guardarProductos(productos);
  },

  eliminarProducto: (id: string) => {
    let productos = storageService.getProductos();
    productos = productos.filter((p: any) => p.id !== id);
    storageService.guardarProductos(productos);
  },

  getProductoById: (id: string) => {
    const productos = storageService.getProductos();
    return productos.find((p: any) => p.id === id);
  },

  // ==================== FACTURAS ====================

  getFacturas: () => {
    const data = localStorage.getItem('facturas');
    return data ? JSON.parse(data) : [];
  },

  guardarFacturas: (facturas: any[]) => {
    localStorage.setItem('facturas', JSON.stringify(facturas));
  },

  agregarFactura: (factura: any) => {
    const facturas = storageService.getFacturas();
    const numero = (facturas.length + 1).toString().padStart(5, '0');
    factura.id = Date.now().toString();
    factura.numero = `FAC-${numero}`;
    factura.fecha = new Date().toISOString();
    factura.estado = 'Pendiente';
    facturas.push(factura);
    storageService.guardarFacturas(facturas);
    return factura;
  },

  editarFactura: (id: string, factura: any) => {
    let facturas = storageService.getFacturas();
    facturas = facturas.map((f: any) => f.id === id ? { ...f, ...factura } : f);
    storageService.guardarFacturas(facturas);
  },

  getFacturaById: (id: string) => {
    const facturas = storageService.getFacturas();
    return facturas.find((f: any) => f.id === id);
  },

  actualizarEstadoFactura: (id: string, estado: string) => {
    let facturas = storageService.getFacturas();
    facturas = facturas.map((f: any) => f.id === id ? { ...f, estado } : f);
    storageService.guardarFacturas(facturas);
  },

  eliminarFactura: (id: string) => {
    let facturas = storageService.getFacturas();
    facturas = facturas.filter((f: any) => f.id !== id);
    storageService.guardarFacturas(facturas);
  },

  // ==================== UTILIDADES ====================

  // Limpiar todos los datos
  limpiarTodo: () => {
    localStorage.removeItem('clientes');
    localStorage.removeItem('productos');
    localStorage.removeItem('facturas');
    localStorage.removeItem('usuarios');
  },

  // Limpiar datos excepto usuarios
  limpiarDatos: () => {
    localStorage.removeItem('clientes');
    localStorage.removeItem('productos');
    localStorage.removeItem('facturas');
  },

  // Exportar datos (para backup)
  exportarDatos: () => {
    return {
      usuarios: storageService.getUsuarios().map((u: any) => {
        const { password, ...rest } = u;
        return rest;
      }),
      clientes: storageService.getClientes(),
      productos: storageService.getProductos(),
      facturas: storageService.getFacturas(),
    };
  },

  // Importar datos
  importarDatos: (datos: any) => {
    if (datos.clientes) storageService.guardarClientes(datos.clientes);
    if (datos.productos) storageService.guardarProductos(datos.productos);
    if (datos.facturas) storageService.guardarFacturas(datos.facturas);
  },
};