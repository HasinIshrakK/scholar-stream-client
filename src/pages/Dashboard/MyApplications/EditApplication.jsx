import { useNavigate } from "react-router";
import { useState } from "react";
import Swal from "sweetalert2";

const EditApplication = () => {
    const navigate = useNavigate();

    // Static dummy data, because I don't know what I should do with this data after updating it
    const [formData, setFormData] = useState({
        phone: "01700000000",
        address: "Dhaka, Bangladesh",
        notes: "Looking forward to this opportunity.",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Application updated successfully",
            showConfirmButton: false,
            timer: 1500,
            theme: 'auto'
        });
        navigate("/dashboard/my-applications");
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Edit Application</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                    <label className="label">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="label">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                    />
                </div>

                <div>
                    <label className="label">Notes</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                    />
                </div>

                <div className="flex gap-3">
                    <button type="submit" className="btn btn-primary">
                        Update
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline"
                    >
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditApplication;
