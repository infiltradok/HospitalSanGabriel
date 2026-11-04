import hashlib
import secrets
import getpass

from database.connection import get_connection


def crear_hash(password):
    salt = secrets.token_bytes(16)
    iteraciones = 600_000

    resultado = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        iteraciones
    )

    return (
        f"pbkdf2_sha256${iteraciones}$"
        f"{salt.hex()}${resultado.hex()}"
    )


def main():
    print("=== CREAR ADMINISTRADOR ===")

    usuario = input("Usuario: ").strip()
    nombre = input("Nombre completo: ").strip()
    password = getpass.getpass("Contraseña: ")

    if not usuario or not nombre or len(password) < 8:
        print("Completa todos los datos. La contraseña debe tener al menos 8 caracteres.")
        return

    password_hash = crear_hash(password)
    conexion = get_connection()

    try:
        cursor = conexion.cursor()

        cursor.execute(
            """
            INSERT INTO dbo.Usuarios
                (nombre, usuario, password_hash, rol, activo)
            VALUES (?, ?, ?, 'ADMIN', 1)
            """,
            (nombre, usuario, password_hash)
        )

        conexion.commit()
        print("Administrador creado correctamente.")

    except Exception as error:
        conexion.rollback()
        print("Error:", error)

    finally:
        conexion.close()


if __name__ == "__main__":
    main()