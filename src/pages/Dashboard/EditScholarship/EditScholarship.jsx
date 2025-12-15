import React, { useContext, useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { AuthContext } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";
import { useParams } from "react-router";
import Loader from "../../../components/Loader";

const EditScholarship = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScholarship = async () => {
            try {
                const res = await axiosInstance.get(`/scholarships/${id}`);
                setFormData(res.data);
            } catch (err) {
                console.error("FETCH SCHOLARSHIPS ERROR:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchScholarship();
    }, [axiosInstance, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const a = {
            ...formData,
            universityWorldRank: Number(formData.universityWorldRank),
            tuitionFees: formData.tuitionFees ? Number(formData.tuitionFees) : null,
            applicationFees: Number(formData.applicationFees),
            serviceCharge: Number(formData.serviceCharge),
            scholarshipUpdatedDate: new Date().toISOString().split("T")[0],
            postedUserEmail: user?.email,
        };

        const { _id, ...b } = a;

        try {
            await axiosInstance.patch(`/scholarships/${id}`, b);

            Swal.fire({
                icon: "success",
                title: "Scholarship Edited",
                text: "Scholarship has been successfully edited",
                theme: "auto"
            });

        } catch (error) {
            console.error("EDIT SCHOLARSHIP ERROR:", error);
            Swal.fire({
                icon: "error",
                title: "Failed",
                text: "Could not edit scholarship",
                theme: 'auto'
            });
        }
    };

    if (loading || !formData) return <Loader />

    return (
        <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-6">Edit This Scholarship</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Scholarship Name */}
                <div>
                    <label className="label font-semibold">Scholarship Name</label>
                    <input type="text" name="scholarshipName" className="input input-bordered w-full" value={formData.scholarshipName} onChange={handleChange} required />
                </div>

                {/* University Name */}
                <div>
                    <label className="label font-semibold">University Name</label>
                    <input type="text" name="universityName" className="input input-bordered w-full" value={formData.universityName} onChange={handleChange} required />
                </div>

                {/* University Image */}
                <div>
                    <label className="label font-semibold">University Image URL</label>
                    <input type="text" name="universityImage" className="input input-bordered w-full" value={formData.universityImage} onChange={handleChange} required />
                </div>

                {/* Country */}
                <div>
                    <label className="label font-semibold">Country</label>
                    <input type="text" name="universityCountry" className="input input-bordered w-full" value={formData.universityCountry} onChange={handleChange} required />
                </div>

                {/* City */}
                <div>
                    <label className="label font-semibold">City</label>
                    <input type="text" name="universityCity" className="input input-bordered w-full" value={formData.universityCity} onChange={handleChange} required />
                </div>

                {/* World Rank */}
                <div>
                    <label className="label font-semibold">World Rank</label>
                    <input type="number" name="universityWorldRank" className="input input-bordered w-full" value={formData.universityWorldRank} onChange={handleChange} required />
                </div>

                {/* Subject Category */}
                <div>
                    <label className="label font-semibold">Subject Category</label>
                    <input type="text" name="subjectCategory" className="input input-bordered w-full" value={formData.subjectCategory} onChange={handleChange} required />
                </div>

                {/* Scholarship Category */}
                <div>
                    <label className="label font-semibold">Scholarship Category</label>
                    <select name="scholarshipCategory" className="select select-bordered w-full" value={formData.scholarshipCategory} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option>Full Fund</option>
                        <option>Partial Fund</option>
                        <option>Self Fund</option>
                    </select>
                </div>

                {/* Degree */}
                <div>
                    <label className="label font-semibold">Degree</label>
                    <select name="degree" className="select select-bordered w-full" value={formData.degree} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option>Bachelors</option>
                        <option>Masters</option>
                        <option>PhD</option>
                    </select>
                </div>

                {/* Tuition Fees (Optional) */}
                <div>
                    <label className="label font-semibold">Tuition Fees (Optional)</label>
                    <input type="number" name="tuitionFees" className="input input-bordered w-full" value={formData.tuitionFees} onChange={handleChange} />
                </div>

                {/* Application Fees */}
                <div>
                    <label className="label font-semibold">Application Fees</label>
                    <input type="number" name="applicationFees" className="input input-bordered w-full" value={formData.applicationFees} onChange={handleChange} required />
                </div>

                {/* Service Charge */}
                <div>
                    <label className="label font-semibold">Service Charge</label>
                    <input type="number" name="serviceCharge" className="input input-bordered w-full" value={formData.serviceCharge} onChange={handleChange} required />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="label font-semibold">Scholarship Description</label>
                    <textarea className="textarea textarea-bordered w-full" rows={3} name="scholarshipDescription" value={formData.scholarshipDescription} onChange={handleChange} required />
                </div>

                {/* Stipend */}
                <div className="md:col-span-2">
                    <label className="label font-semibold">Stipend Coverage</label>
                    <textarea className="textarea textarea-bordered w-full" rows={2} name="stipendCoverage" value={formData.stipendCoverage} onChange={handleChange} required />
                </div>

                {/* Deadline */}
                <div>
                    <label className="label font-semibold">Application Deadline</label>
                    <input type="date" name="applicationDeadline" className="input input-bordered w-full" value={formData.applicationDeadline} onChange={handleChange} required />
                </div>

                <div className="md:col-span-2">
                    <button type="submit" className="btn btn-primary w-full">
                        Update Scholarship
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditScholarship;