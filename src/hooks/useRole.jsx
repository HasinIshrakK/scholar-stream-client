import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import useAxios from "./useAxios";

const useRole = () => {
    const { user } = useAuth();
    const axiosInstance = useAxios();

    const [role, setRole] = useState("student");
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        if (!user?.email) {
            setRole("student");
            setRoleLoading(false);
            return;
        }

        const fetchRole = async () => {
            try {
                setRoleLoading(true);
                const res = await axiosInstance.get(`/users/${user.email}`);
                setRole(res.data?.role || "student");
            } catch (err) {
                console.error("Failed to fetch role:", err);
                setRole("student");
            } finally {
                setRoleLoading(false);
            }
        };

        fetchRole();
    }, [user, axiosInstance]);

    return { role, roleLoading };
};

export default useRole;
