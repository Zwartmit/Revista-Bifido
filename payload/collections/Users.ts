import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
    slug: 'users',
    labels: {
        singular: 'Usuario',
        plural: 'Usuarios',
    },
    auth: {
        forgotPassword: {
            generateEmailHTML: (args) => {
                const token = args?.token;
                const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
                const resetPasswordURL = `${serverURL}/admin/reset/${token}`;

                return `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { background-color: #f4f4f4; color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
                        .container { max-width: 520px; margin: 50px auto; padding: 40px; background-color: #ffffff; border: 1px solid #e0e0e0; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
                        .logo { text-align: center; margin-bottom: 40px; }
                        h1 { color: #000000; font-size: 26px; font-weight: 900; text-transform: uppercase; letter-spacing: -0.5px; text-align: center; margin-bottom: 20px; border-bottom: 4px solid #ccfd29; display: inline-block; padding-bottom: 5px; }
                        .header-container { text-align: center; margin-bottom: 30px; }
                        p { font-size: 16px; line-height: 1.5; color: #333333; margin-bottom: 25px; text-align: center; }
                        .button-container { text-align: center; margin: 40px 0; }
                        .button { background-color: #ccfd29; color: #000000 !important; padding: 18px 36px; text-decoration: none; border-radius: 2px; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; display: inline-block; border: 2px solid #ccfd29; }
                        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; padding-top: 30px; }
                        .link-alt { margin-top: 30px; font-size: 11px; color: #999999; text-align: center; font-style: italic; }
                        .link-alt a { color: #000000; text-decoration: underline; }
                    </style>
                </head>
                <body>
                    <div class="container" style="background-color: #ffffff; padding: 40px; border: 1px solid #e0e0e0;">
                        <div class="logo" style="text-align: center; margin-bottom: 30px;">
                            <img src="${serverURL}/favicon/favicon-96x96.png" alt="REVISTA BÍFIDO" style="width: 70px; height: auto;">
                        </div>
                        <div class="header-container" style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #000000; font-size: 24px; font-weight: 900; text-transform: uppercase; border-bottom: 4px solid #ccfd29; padding-bottom: 5px; display: inline-block;">Recuperar Acceso</h1>
                        </div>
                        <p style="font-size: 16px; color: #333333; text-align: center; line-height: 1.5;">Has solicitado restablecer la contraseña de tu cuenta en el panel administrativo de <strong>Revista Bífido</strong>.</p>
                        <div class="button-container" style="text-align: center; margin: 40px 0;">
                            <a href="${resetPasswordURL}" style="background-color: #ccfd29; color: #000000 !important; padding: 18px 36px; text-decoration: none; border-radius: 0px; font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; display: inline-block; border: 1px solid #ccfd29;">
                                <span style="color: #000000 !important;">Restablecer contraseña</span>
                            </a>
                        </div>
                        <p style="font-size: 14px; color: #666666; text-align: center;">Si no solicitaste este cambio, puedes ignorar este correo sin problemas.</p>
                        <div class="link-alt" style="margin-top: 40px; text-align: center; font-size: 11px; color: #999999;">
                            ¿Problemas con el botón? Copia este enlace:<br>
                            <a href="${resetPasswordURL}" style="color: #000000;">${resetPasswordURL}</a>
                        </div>
                        <div class="footer" style="margin-top: 50px; text-align: center; font-size: 11px; color: #999999; border-top: 1px solid #eeeeee; padding-top: 20px;">
                            &copy; ${new Date().getFullYear()} REVISTA BÍFIDO
                        </div>
                    </div>
                </body>
                </html>
                `;
            },
        },
    },
    access: {
        admin: ({ req: { user } }) => user?.role === 'admin',
        create: ({ req: { user } }) => user?.role === 'admin',
        delete: ({ req: { user } }) => user?.role === 'admin',
        update: ({ req: { user } }) => user?.role === 'admin',
        read: ({ req: { user } }) => !!user, // Logged in users can see the list
    },
    admin: {
        useAsTitle: 'email',
    },
    fields: [
        {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            required: true,
        },
        {
            name: 'role',
            label: 'Rol',
            type: 'select',
            required: true,
            defaultValue: 'editor',
            options: [
                {
                    label: 'Administrador',
                    value: 'admin',
                },
                {
                    label: 'Editor',
                    value: 'editor',
                },
                {
                    label: 'Autor',
                    value: 'author',
                },
            ],
        },
    ],
};
