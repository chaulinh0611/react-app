import {useState} from "react"
import {Button} from "@/shared/ui/button/button"
import {getUser} from "@/features/dashboard/model/getUser"

interface RoleType {
  id: string;
  name: string;
  description: string;
}

interface UserType {
  id: string;
  name: string;
  email: string;
  role: RoleType[];
}
const Dashboard = () => {
    const [user, setUser] = useState<UserType | null>(null);
    const fetchUser = async () => {
        try{
        const userData = await getUser();
        setUser(userData);
        } catch (error) {
            console.error("Error: ", error);
        }
    };
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4 text-blue-600">Hiiiii</h1>
            {user && (<div className="mb-4">
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role.map(r => r.name).join(", ")}</p>
                </div>)}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded" onClick={fetchUser}>Get User Info</Button>
        </div>
    )
}
export default Dashboard;