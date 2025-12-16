import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Loader from "../../../components/Loader";
import useAxios from "../../../hooks/useAxios";

const Success = () => {
    const [searchParams] = useSearchParams();
    const session_id = searchParams.get("session_id");
    const navigate = useNavigate();
    const axiosInstance = useAxios();

    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        if (!session_id) return navigate("/dashboard/payment-failed");

        const verifyPayment = async () => {
            try {
                const res = await axiosInstance.patch(`/verify-payment/${session_id}`);
                if (!res.data.success) {
                    navigate("/dashboard/payment-failed");
                } else {
                    setPaymentData(res.data);
                }
            } catch (err) {
                navigate("/dashboard/payment-failed");
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [session_id, axiosInstance, navigate]);

    if (loading) return <Loader />;

    return (
        <div className="max-w-xl mx-auto mt-20 p-6 bg-base-100 shadow rounded text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
                Payment Successful 🎉
            </h2>

            <div className="space-y-2 text-left mb-6">
                <p><strong>Scholarship:</strong> {paymentData.scholarshipName}</p>
                <p><strong>University:</strong> {paymentData.universityName}</p>
                <p><strong>Amount Paid:</strong> {paymentData.amountPaid} {paymentData.currency.toUpperCase()}</p>
            </div>

            <button onClick={() => navigate("/dashboard/my-applications")} className="btn btn-primary w-full">
                Go to My Applications
            </button>
        </div>
    );
};

export default Success;