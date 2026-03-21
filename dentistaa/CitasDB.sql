-- ============================================
-- BASE DE DATOS CLINICA DENTAL - VERSIÓN FINAL
-- ============================================

CREATE DATABASE ClinicaDental;
GO

USE ClinicaDental;
GO

-- ============================================
-- TABLA: ROLES (SOLO PARA PERSONAL DEL SISTEMA)
-- ============================================
CREATE TABLE ROLES (
    RolID INT PRIMARY KEY,
    NombreRol NVARCHAR(50) NOT NULL,
    Descripcion NVARCHAR(100) NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT UK_ROLES_NombreRol UNIQUE (NombreRol)
);
GO

-- ============================================
-- TABLA: USUARIOS (PERSONAL: ADMIN, DOCTOR, RECEPCIONISTA)
-- ============================================
CREATE TABLE USUARIOS (
    UsuarioID INT IDENTITY(1,1) PRIMARY KEY,
    RolID INT NOT NULL,
    NombreCompleto NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20) NULL,
    NombreUsuario NVARCHAR(50) NOT NULL,
    ContrasenaHash NVARCHAR(255) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1,
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_USUARIOS_ROL FOREIGN KEY (RolID) REFERENCES ROLES(RolID),
    CONSTRAINT UK_USUARIOS_Email UNIQUE (Email),
    CONSTRAINT UK_USUARIOS_NombreUsuario UNIQUE (NombreUsuario)
);
GO

-- ============================================
-- TABLA: PACIENTES (CLIENTES QUE PUEDEN INICIAR SESIÓN)
-- ============================================
CREATE TABLE PACIENTES (
    PacienteID INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    Telefono NVARCHAR(20) NULL,
    FechaNacimiento DATE NOT NULL,
    Direccion NVARCHAR(255) NULL,
    NombreUsuario NVARCHAR(50) NULL,        -- Para login de pacientes
    ContrasenaHash NVARCHAR(255) NULL,       -- Para login de pacientes
    Activo BIT NOT NULL DEFAULT 1,           -- Para activar/desactivar pacientes
    FechaRegistro DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT UK_PACIENTES_Email UNIQUE (Email),
    CONSTRAINT UK_PACIENTES_NombreUsuario UNIQUE (NombreUsuario)
);
GO

-- ============================================
-- TABLA: SERVICIOS
-- ============================================
CREATE TABLE SERVICIOS (
    ServicioID INT IDENTITY(1,1) PRIMARY KEY,
    NombreServicio NVARCHAR(100) NOT NULL,
    Descripcion NVARCHAR(255) NULL,
    DuracionMinutos INT NOT NULL,
    Precio DECIMAL(10, 2) NOT NULL,
    Activo BIT NOT NULL DEFAULT 1
);
GO

-- ============================================
-- TABLA: CITAS
-- ============================================
CREATE TABLE CITAS (
    CitaID INT IDENTITY(1,1) PRIMARY KEY,
    PacienteID INT NOT NULL,
    ServicioID INT NOT NULL,
    UsuarioID INT NULL,                      -- Ahora puede ser NULL (citas sin doctor asignado aún)
    FechaCita DATE NOT NULL,
    HoraCita TIME(0) NOT NULL,
    Estado NVARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    Notas NVARCHAR(MAX) NULL,
    FechaCreacion DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_CITAS_PACIENTE FOREIGN KEY (PacienteID) REFERENCES PACIENTES(PacienteID),
    CONSTRAINT FK_CITAS_SERVICIO FOREIGN KEY (ServicioID) REFERENCES SERVICIOS(ServicioID),
    CONSTRAINT FK_CITAS_USUARIO FOREIGN KEY (UsuarioID) REFERENCES USUARIOS(UsuarioID),
    CONSTRAINT CHK_CITAS_Estado CHECK (Estado IN ('Pendiente', 'Confirmada', 'Cancelada', 'Completada'))
);
GO

-- ============================================
-- TABLA: EXPEDIENTES
-- ============================================
CREATE TABLE EXPEDIENTES (
    ExpedienteID INT IDENTITY(1,1) PRIMARY KEY,
    PacienteID INT NOT NULL,
    CitaID INT NOT NULL,
    UsuarioID INT NOT NULL,
    FechaConsulta DATETIME NOT NULL DEFAULT GETDATE(),
    MotivoConsulta NVARCHAR(MAX) NULL,
    Diagnostico NVARCHAR(MAX) NULL,
    Tratamiento NVARCHAR(MAX) NULL,
    Observaciones NVARCHAR(MAX) NULL,
    CONSTRAINT FK_EXPEDIENTES_PACIENTE FOREIGN KEY (PacienteID) REFERENCES PACIENTES(PacienteID),
    CONSTRAINT FK_EXPEDIENTES_CITA FOREIGN KEY (CitaID) REFERENCES CITAS(CitaID),
    CONSTRAINT FK_EXPEDIENTES_USUARIO FOREIGN KEY (UsuarioID) REFERENCES USUARIOS(UsuarioID)
);
GO

-- ============================================
-- ÍNDICES PARA RENDIMIENTO
-- ============================================
CREATE INDEX IX_CITAS_FechaCita ON CITAS(FechaCita);
CREATE INDEX IX_CITAS_PacienteID ON CITAS(PacienteID);
CREATE INDEX IX_CITAS_Estado ON CITAS(Estado);
CREATE INDEX IX_CITAS_UsuarioID ON CITAS(UsuarioID);
CREATE INDEX IX_EXPEDIENTES_PacienteID ON EXPEDIENTES(PacienteID);
CREATE INDEX IX_USUARIOS_RolID ON USUARIOS(RolID);
CREATE INDEX IX_PACIENTES_NombreUsuario ON PACIENTES(NombreUsuario);
GO

-- ============================================
-- DATOS INICIALES
-- ============================================

-- Insertar roles (solo 3 roles para personal)
INSERT INTO ROLES (RolID, NombreRol, Descripcion) VALUES 
(1, 'admin', 'Administrador del sistema con todos los permisos'),
(2, 'doctor', 'Doctor del consultorio con permisos de consulta y expedientes'),
(3, 'recepcionista', 'Encargado de modificar citas, registrar y modificar servicios');
GO

-- Insertar usuarios del sistema (personal)
INSERT INTO USUARIOS (RolID, NombreCompleto, Email, Telefono, NombreUsuario, ContrasenaHash, Activo) VALUES 
(1, 'Administrador del Sistema', 'admin@clinica.com', '6641234567', 'admin', 'admin123', 1),
(2, 'Dr. Juan Pérez', 'doctor@clinica.com', '6641234568', 'doctor', 'doctor123', 1),
(3, 'María Recepcionista', 'recepcionista@clinica.com', '6641234569', 'recepcionista', 'recepcionista123', 1);
GO

-- Insertar servicios
INSERT INTO SERVICIOS (NombreServicio, Descripcion, DuracionMinutos, Precio, Activo) VALUES 
('Consulta General', 'Consulta dental general', 30, 500.00, 1),
('Limpieza Dental', 'Limpieza y profilaxis dental', 45, 800.00, 1),
('Blanqueamiento', 'Blanqueamiento dental', 60, 2500.00, 1),
('Extracción', 'Extracción de piezas dentales', 45, 1200.00, 1),
('Ortodoncia', 'Tratamiento de ortodoncia', 60, 3500.00, 1),
('Endodoncia', 'Tratamiento de conductos', 60, 2000.00, 1);
GO

-- Insertar pacientes de ejemplo (con credenciales para login)
INSERT INTO PACIENTES (NombreCompleto, Email, Telefono, FechaNacimiento, Direccion, NombreUsuario, ContrasenaHash, Activo) VALUES 
('Carlos López García', 'carlos@email.com', '6641234570', '1990-05-15', 'Av. Principal 123', 'carlos', 'carlos123', 1),
('Ana María Rodríguez', 'ana@email.com', '6641234571', '1985-08-20', 'Calle Juárez 456', 'ana', 'ana123', 1),
('Miguel Sánchez Torres', 'miguel@email.com', '6641234572', '1978-11-30', 'Blvd. Centro 789', 'miguel', 'miguel123', 1);
GO

------------------------------------------------
------------------------------------------------
-- Insertar citas de ejemplo (con UsuarioID NULL = sin doctor asignado aún)
INSERT INTO CITAS (PacienteID, ServicioID, UsuarioID, FechaCita, HoraCita, Estado, Notas) VALUES 
(1, 1, NULL, DATEADD(day, 1, GETDATE()), '10:00:00', 'Pendiente', 'Paciente nuevo, primera consulta'),
(2, 2, NULL, DATEADD(day, 2, GETDATE()), '11:30:00', 'Pendiente', 'Limpieza de rutina'),
(1, 4, 2, DATEADD(day, 3, GETDATE()), '09:00:00', 'Confirmada', 'Dolor en muela inferior derecha');
GO

-- ============================================
-- CONSULTAS DE VERIFICACIÓN
-- ============================================

-- Ver todos los roles
SELECT * FROM ROLES;
GO

-- Ver usuarios del sistema
SELECT * FROM USUARIOS;
GO

-- Ver pacientes (clientes)
SELECT * FROM PACIENTES;
GO

-- Ver servicios
SELECT * FROM SERVICIOS;
GO

-- Ver citas
SELECT 
    c.CitaID,
    p.NombreCompleto AS Paciente,
    s.NombreServicio AS Servicio,
    u.NombreCompleto AS Doctor,
    c.FechaCita,
    c.HoraCita,
    c.Estado,
    c.Notas
FROM CITAS c
LEFT JOIN PACIENTES p ON c.PacienteID = p.PacienteID
LEFT JOIN SERVICIOS s ON c.ServicioID = s.ServicioID
LEFT JOIN USUARIOS u ON c.UsuarioID = u.UsuarioID
ORDER BY c.FechaCita DESC;
GO