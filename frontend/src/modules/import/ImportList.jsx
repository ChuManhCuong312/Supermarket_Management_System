import React, { useEffect, useState } from "react";
import importService from "./importService";
import ImportForm from "./ImportForm";
import ImportFilter from "./ImportFilter";

const ImportList = () => {
    const [imports, setImports] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadData = async (p = 0) => {
        setLoading(true);
        try {
            const res = await importApi.getAll(p, 10);
            setImports(res.data.imports);
            setPage(res.data.currentPage);
            setTotalPages(res.data.totalPages);
            setError("");
        } catch (err) {
            setError("Failed to load imports");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure to delete this import?")) {
            await importApi.remove(id);
            loadData(page);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-semibold mb-3">Import Management</h2>

            <ImportFilter onFilter={setImports} />

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <table className="w-full border mt-3">
                <thead className="bg-gray-100">
                    <tr>
                        <th>ID</th>
                        <th>Supplier ID</th>
                        <th>Date</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Note</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {imports.map((imp) => (
                        <tr key={imp.id} className="border-b text-center">
                            <td>{imp.id}</td>
                            <td>{imp.supplierId}</td>
                            <td>{imp.importDate}</td>
                            <td>{imp.totalAmount}</td>
                            <td>{imp.status}</td>
                            <td>{imp.note}</td>
                            <td>
                                <button
                                    className="text-blue-600 mx-1"
                                    onClick={() => setSelected(imp)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-600 mx-1"
                                    onClick={() => handleDelete(imp.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="mt-3">
                <button
                    disabled={page === 0}
                    onClick={() => loadData(page - 1)}
                    className="px-3 py-1 border mx-1"
                >
                    Prev
                </button>
                <button
                    disabled={page + 1 >= totalPages}
                    onClick={() => loadData(page + 1)}
                    className="px-3 py-1 border mx-1"
                >
                    Next
                </button>
            </div>

            <hr className="my-4" />
            <ImportForm
                selected={selected}
                onSaved={() => {
                    setSelected(null);
                    loadData();
                }}
            />
        </div>
    );
};

export default ImportList;
