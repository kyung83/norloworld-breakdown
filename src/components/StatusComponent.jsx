import { useState, useEffect } from "react";
import useAxios from "axios-hooks"; // Asegúrate de que estés importando useAxios desde axios-hooks
import ComboBox from "./ComboBox";
import Spinner from "./Spinner";
import { DataGrid } from '@mui/x-data-grid';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from 'react-router-dom';

const endPoint =
    "https://script.google.com/macros/s/AKfycbxQvcen9VHd-lysj7SjmT5Vj5PWqUUMmP2n--SCgOIXc57YKvR7mdR9KioNNqnIetyk/exec";

export default function StatusComponent() {
    const [{ data, loading, error }] = useAxios(endPoint);
    const [
        { data: postData, loading: postLoading, error: postError },
        executePost,
      ] = useAxios(
        {
          url: endPoint + "?route=setArrived",
          method: "POST",
        },
        { manual: true }
      );
    const [selectedName, setSelectedName] = useState("");
    const [breakdowns, setBreakdowns] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState({});
    const [warning, setWarning] = useState(false);

    useEffect(() => {
        if (selectedDriver.name && data.breakdownsOpen) {
            const driverBreakdowns = data.breakdownsOpen.filter(breakdown => breakdown.data[2] === selectedDriver.name);
            const breakdownsForName = driverBreakdowns.map((breakdown, idx) => ({
                id: breakdown.row.toString(),
                breakdownDate: breakdown.data[1],
                driver: breakdown.data[2],
                truck: breakdown.data[3],
                trailer: breakdown.data[4],
                state: breakdown.data[5],
                city: breakdown.data[6]
            }));

            setBreakdowns(breakdownsForName);
            setSelectedName(selectedDriver.name);
        }
    }, [selectedDriver, data]);

    const columns = [
        { field: 'breakdownDate', headerName: 'Breakdown Date', width: 200 },
        { field: 'driver', headerName: 'Driver', width: 200 },
        { field: 'truck', headerName: 'Truck #', width: 100 },
        { field: 'trailer', headerName: 'Trailer #', width: 100 },
        { field: 'state', headerName: 'State', width: 100 },
        { field: 'city', headerName: 'City', width: 200 },
        {
            field: 'setArrived',
            headerName: 'Set Arrived',
            width: 150,
            renderCell: (params) => (
                <button
                    onClick={() => handleSetArrived(params.row)}
                    className="rounded-md bg-emerald-700 px-6 py-1 text-sm font-semibold text-white shadow-sm hover:bg-emerald-400"
                >
                    Set Arrived
                </button>
            ),
        },
    ];

    const navigate = useNavigate();

    const handleSetArrived = async (selectedBreakdown) => {
        try {
          const response = await executePost({
            data: JSON.stringify(selectedBreakdown),
          });
          if (response.status === 200) {
            // La solicitud fue exitosa
            console.log("Set Arrived successful");
            toast.success("Set Arrived successful"); // Muestra una notificación de éxito
      
            // Recarga la página después de 2 segundos
            setTimeout(() => {
  navigate('/norloworld-breakdown/');
}, 2000); 
          } else {
            console.error("Set Arrived failed");
            toast.error("Set Arrived failed"); // Muestra una notificación de error
          }
        } catch (error) {
          console.error("Error:", error);
          toast.error("Error occurred"); // Muestra una notificación de error
        }
      };
      

    if (loading) return <Spinner />;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            {warning && (
                <p className="text-sm text-red-600 mt-4 mb-4" id="email-error">
                    Complete the required fields *
                </p>
            )}
            <div className="flex justify-between space-x-4">
                <ComboBox
                    title="* Driver Name"
                    items={data.drivers.map((name, i) => ({ id: i, name }))}
                    selectedPerson={selectedDriver}
                    setSelectedPerson={setSelectedDriver}
                />
            </div>
            <ToastContainer />
            <h1>Breakdowns:</h1>
            <div style={{ height: 400, width: '80%', display: 'flex', justifyContent: 'center' }}>
                <DataGrid
                    rows={breakdowns}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10]}
                />
            </div>
        </div>
    );
}
