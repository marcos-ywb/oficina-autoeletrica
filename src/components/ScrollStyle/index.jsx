export default function ScrollStyle() {
    return (
        <style jsx global>{`
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #1a1a1a;
            }

            ::-webkit-scrollbar-thumb {
                background: #555;
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #777;
            }
        `}</style>
    );
}