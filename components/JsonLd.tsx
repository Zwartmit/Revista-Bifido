/** Inserta datos estructurados (schema.org) como JSON-LD. Server component. */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            // "<" escapado para que ningún texto del CMS pueda cerrar la etiqueta <script>
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
    );
}
