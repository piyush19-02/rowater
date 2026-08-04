import DeliveryWorkspace from "../admin/Delivery";
import ManagerSidebar from "../../components/ManagerSidebar";
import { useManager } from "../../context/ManagerContext";

// Managers use the same live delivery workspace, protected by the manager route.
export default function ManagerDelivery() {
  const { currentManager } = useManager();
  return <DeliveryWorkspace SidebarComponent={ManagerSidebar} managerId={currentManager?.id} />;
}
