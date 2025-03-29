import { useOutletContext } from "react-router-dom";

// interface ClientContext {
//   const { client, setClient } = useOutletContext<ClientContext>();
//     name: string;
//     lastName: string;
//     phoneNumber: string;
//     date: string;
//     location: string;
//   };
//   setClient: (client: {
//     name: string;
//     lastName: string;
//     phoneNumber: string;
//     date: string;
//     location: string;
//   }) => void;
// }

export default function ClientBooking() {
  const { client, setClient } = useOutletContext();
  const { name, lastName, phoneNumber, date, location } = client;

  return (
    <div>
      {/* Client Data */}
      <div className="flex flex-col gap-6">
        <div className="text-lg font-bold flex gap-1">
          Datos cliente <p className="text-red-500">*</p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <input
            type="text"
            name="name"
            defaultValue={name}
            placeholder="Nombre Cliente"
            className=" rounded-xl p-2 w-6/12 hover:bg-gray-100 outline-2"
            onChange={(event) =>
              setClient({ ...client, name: event.target.value })
            }
            required
          />
          <input
            type="text"
            name="name"
            defaultValue={lastName}
            placeholder="Apellido Cliente"
            className=" rounded-xl p-2 w-6/12 hover:bg-gray-100 outline-2"
            onChange={(event) =>
              setClient({ ...client, lastName: event.target.value })
            }
            required
          />
          <input
            type="text"
            name="phone"
            defaultValue={phoneNumber}
            placeholder="Telefono Cliente"
            className=" rounded-xl p-2 w-6/12 hover:bg-gray-100 outline-2"
            onChange={(event) =>
              setClient({ ...client, phoneNumber: event.target.value })
            }
            required
          />
        </div>
      </div>

      {/* Event Information */}
      <div className="flex flex-col gap-6">
        <div className="text-lg font-bold">Evento</div>
        <div className="flex flex-col items-center gap-8">
          <input
            type="text"
            name="location"
            defaultValue={location}
            placeholder="Nombre/Ubicacion del salon"
            className=" rounded-xl p-2 w-6/12 hover:bg-gray-100 outline-2"
            onChange={(eventLocation) =>
              setClient({
                ...client,
                location: eventLocation.target.value,
              })
            }
          />

          <input
            type="date"
            value={date}
            onChange={(eventDate) =>
              setClient({ ...client, date: eventDate.target.value })
            }
            className=" rounded-xl p-2 w-6/12 hover:bg-gray-100 outline-2"
          />
        </div>
      </div>
    </div>
  );
}
