-- Crear la base de datos
CREATE DATABASE citas_db;
GO

-- Usar la base de datos
USE citas_db;
GO

-- Crear la tabla citas
CREATE TABLE dbo.citas (
    id INT NOT NULL PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NULL,
    correo VARCHAR(100) NULL,
    fecha VARCHAR(20) NULL,
    hora VARCHAR(20) NULL,
    motivo VARCHAR(MAX) NULL
);
GO
