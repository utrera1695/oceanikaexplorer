import { useState } from "react";
import SearchSelectorComponent from "./app/components/searchSelector";
import CargoSelector from "./app/components/cargoSelector";
import Modal from "./app/components/modalComponent";

import PhoneInput from "react-phone-number-input";
import { Controller, useForm } from "react-hook-form";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";

import "react-phone-number-input/style.css";

function App() {
	const [searchType, setSearchType] = useState("Marítimo");

	const [originSelected, setOriginSelected] = useState<any | null>(null);
	const [destinationSelected, setDestinationSelected] = useState<any | null>(
		null
	);
	const [maritimeType, setMaritimeType] = useState("FCL");
	const [isOpen, setIsOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const {
		control,
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: {
			fullname: "",
			companyname: "",
			email: "",
			phone: "",
			cargos: [
				{
					containerType: "Contenedor 20ft",
					quantity: 1,
					weight: 0,
					unitWeight: "KG",
					unitDimensions: "CM",
					length: 0,
					width: 0,
					height: 0,
				},
			],
			date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // Default to today's date
		},
	});

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const onSubmit = (data: any) => {
		setLoading(true);
		const body = {
			origin: originSelected,
			destination: destinationSelected,
			cargos: data.cargos,
			fullname: data.fullname,
			companyname: data.companyname,
			email: data.email,
			phone: data.phone,
			date: moment(data.date).format("DD-MM-YYYY"),
			requestDate: moment(new Date()).format("DD-MM-YYYY HH:mm:ss"),
			searchType,
			maritimeType,
		};
		console.log(body);
		fetch("https://oceanikaexplorer-api.onrender.com/send-email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					reset();
					setOriginSelected(null);
					setDestinationSelected(null);
					closeModal();
					toast("Solicitud enviada!", {
						position: "top-center",
						autoClose: 5000,
						hideProgressBar: true,
						closeOnClick: true,
						pauseOnHover: false,
						draggable: false,
						progress: undefined,
						theme: "light",
					});
				} else {
					alert("Error al enviar el correo: " + data.error);
				}
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error en la solicitud:", error);
				setLoading(false);
			});
	};

	const isDisabled = () => {
		if (!originSelected?.country || !destinationSelected?.country) return true;
		if (
			errors.cargos &&
			Array.isArray(errors.cargos) &&
			errors.cargos.some(
				(cargoError) => cargoError && Object.keys(cargoError).length > 0
			)
		) {
			return true;
		}
		return false;
	};
	return (
		<div>
			<div className='buttonSelector'>
				<button
					className={`${
						searchType === "Marítimo" && maritimeType === "FCL"
							? "isActive"
							: ""
					}`}
					onClick={() => {
						setMaritimeType("FCL");
						setSearchType("Marítimo");
					}}
				>
					Marítimo FCL
				</button>
				<button
					className={`${
						searchType === "Marítimo" && maritimeType === "LCL"
							? "isActive"
							: ""
					}`}
					onClick={() => {
						setMaritimeType("LCL");
						setSearchType("Marítimo");
					}}
				>
					Marítimo LCL
				</button>
				<button
					className={`${searchType === "Aéreo" ? "isActive" : ""} `}
					onClick={() => setSearchType("Aéreo")}
				>
					Carga Aerea
				</button>
			</div>
			<div className='form'>
				<SearchSelectorComponent
					locationSelected={originSelected}
					setLocationSelected={setOriginSelected}
					title='Origen'
					searchType={searchType}
				/>
				<SearchSelectorComponent
					locationSelected={destinationSelected}
					setLocationSelected={setDestinationSelected}
					title='Destino'
					searchType={searchType}
				/>
				<CargoSelector
					title='Carga'
					searchType={searchType}
					maritimeType={maritimeType}
					control={control}
					errors={errors}
					register={register}
				/>

				<button
					onClick={openModal}
					id='myBtn'
					className='searchButton'
					disabled={isDisabled()}
				>
					Solicitar
				</button>
			</div>
			<Modal isOpen={isOpen} onClose={closeModal}>
				<p>Completa tus datos para poder tener un calculo de tu envio</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='modal-form'>
						<div className='form-input'>
							<label htmlFor=''>Nombre completo *</label>
							<input
								type='text'
								{...register(`fullname`, {
									required: "Debes ingresar tu nombre completo",
									minLength: {
										value: 3,
										message: "El nombre debe tener al menos 3 caracteres",
									},
								})}
							></input>
						</div>
						{errors.fullname && (
							<p className='errorText'>{errors.fullname.message}</p>
						)}
						<div className='form-input'>
							<label htmlFor=''>Nombre de la compañia *</label>
							<input
								type='text'
								{...register(`companyname`, {
									required: "El nombre de la compañia es obligatorio",
									minLength: {
										value: 3,
										message: "El nombre debe tener al menos 3 caracteres",
									},
								})}
							></input>
						</div>
						{errors.companyname && (
							<p className='errorText'>{errors.companyname.message}</p>
						)}
						<div className='form-input'>
							<label htmlFor=''>Correo electrónico *</label>
							<input
								type='text'
								{...register(`email`, {
									required: "El correo es obligatorio",
									pattern: {
										value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
										message: "Formato de correo inválido",
									},
								})}
							></input>
						</div>
						{errors.email && (
							<p className='errorText'>{errors.email.message}</p>
						)}
						<div className='form-input'>
							<label htmlFor=''>Teléfono *</label>
							<Controller
								name='phone'
								control={control}
								rules={{
									required: "El número es obligatorio",
									validate: (value) => {
										if (!value) return "El número es obligatorio";
										const isValid = /^\+?[1-9]\d{1,14}$/.test(value);
										return isValid || "Debes ingresar un número válido";
									},
								}}
								render={({ field }) => (
									<>
										<PhoneInput
											{...field}
											international
											defaultCountry='US'
											className='w-full border px-3 py-2 rounded mt-1'
										/>
									</>
								)}
							/>
						</div>
						{errors.phone && (
							<p className='errorText'>{errors.phone.message}</p>
						)}
					</div>

					<button type='submit' className='searchButton' disabled={loading}>
						{loading ? (
							<i className='fa fa-spinner fa-spin'></i>
						) : (
							<span>Enviar solicitud</span>
						)}
					</button>
				</form>
			</Modal>
			<ToastContainer />
		</div>
	);
}

export default App;
