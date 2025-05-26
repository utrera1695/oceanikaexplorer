import { useFieldArray } from "react-hook-form";
import "assets/styles/cargoSelector.scss";

type CargoSelectorType = {
	title: string;
	searchType: string;
	maritimeType: string;
	control: any;
	register: any;
	errors: any;
};
function CargoSelector({
	title,
	searchType,
	maritimeType,
	control,
	register,
	errors,
}: CargoSelectorType) {
	const { fields, append, remove } = useFieldArray({
		control,
		name: "cargos",
	});
	return (
		<>
			<div className='cargoSelector'>
				<label htmlFor=''>{title}</label>
			</div>
			{fields.map((field, index) => (
				<>
					<div key={field.id} className='containerSelector'>
						{searchType === "maritimo" && maritimeType === "FCL" ? (
							<div style={{ display: "flex", width: "100%" }}>
								<div className='form-input full' style={{ width: "100%" }}>
									<label htmlFor=''>Tipo de contenedor</label>
									<select {...register(`cargos.${index}.containerType`)}>
										<option value='Contenedor 20ft'>Contenedor 20ft</option>
										<option value='Contenedor 40ft'>Contenedor 40ft</option>
										<option value='Contenedor 40HC'>Contenedor 40HC</option>
									</select>
								</div>
								<div className='form-input'>
									<label htmlFor=''>Cantidad</label>
									<input
										type='number'
										min={1}
										defaultValue={1}
										{...register(`cargos.${index}.quantity`, {
											valueAsNumber: true,
										})}
									></input>
								</div>
							</div>
						) : (
							<div style={{ width: "100%" }}>
								<div className='form-group' style={{ marginBottom: "2px" }}>
									<div className='form-input full'>
										<label htmlFor=''>Cantidad * </label>
										<input
											type='number'
											defaultValue={1}
											min={1}
											{...register(`cargos.${index}.quantity`, {
												valueAsNumber: true,
												required: "Requerido",
											})}
										></input>
										{errors.cargos?.[index]?.quantity && (
											<p className='errorText'>
												{errors.cargos[index].quantity.message}
											</p>
										)}
									</div>
									<div className='form-input full'>
										<label htmlFor=''>Peso</label>
										<input
											type='number'
											defaultValue={1}
											min={0}
											{...register(`cargos.${index}.weight`, {
												valueAsNumber: true,
												required: "Requerido",
											})}
										></input>
										{errors.cargos?.[index]?.weight && (
											<p className='errorText'>
												{errors.cargos[index].weight.message}
											</p>
										)}
									</div>
									<div className='form-input full'>
										<label htmlFor=''>Unidad</label>
										<select {...register(`cargos.${index}.unitWeight`)}>
											<option value='KG'>KG</option>
											<option value='LB'>LB</option>
										</select>
									</div>
								</div>
								<div className='form-group'>
									<div className='form-input full'>
										<label htmlFor=''>Largo * </label>
										<input
											type='number'
											defaultValue={1}
											min={0}
											{...register(`cargos.${index}.length`, {
												valueAsNumber: true,
												required: "Requerido",
											})}
										></input>
										{errors.cargos?.[index]?.length && (
											<p className='errorText'>
												{errors.cargos[index].length.message}
											</p>
										)}
									</div>
									<div className='form-input full'>
										<label htmlFor=''>Ancho *</label>
										<input
											type='number'
											defaultValue={1}
											min={0}
											{...register(`cargos.${index}.width`, {
												valueAsNumber: true,
												required: "Requerido",
											})}
										></input>
										{errors.cargos?.[index]?.width && (
											<p className='errorText'>
												{errors.cargos[index].width.message}
											</p>
										)}
									</div>
									<div className='form-input full'>
										<label htmlFor=''>Alto *</label>
										<input
											type='number'
											defaultValue={1}
											min={0}
											{...register(`cargos.${index}.height`, {
												valueAsNumber: true,
												required: "Requerido",
											})}
										></input>
										{errors.cargos?.[index]?.height && (
											<p className='errorText'>
												{errors.cargos[index].height.message}
											</p>
										)}
									</div>
									<div className='form-input full'>
										<label htmlFor=''>Unidad</label>
										<select {...register(`cargos.${index}.unitDimensions`)}>
											<option value='CM'>CM</option>
											<option value='IN'>IN</option>
										</select>
									</div>
								</div>
							</div>
						)}
					</div>
				</>
			))}
			<div className='addSelectors'>
				<button
					disabled={fields.length == 1}
					onClick={() => remove(fields.length - 1)}
				>
					<i className='fa-solid fa-minus'></i>
				</button>
				<button
					disabled={fields.length == 3}
					onClick={() =>
						append({
							containerType: "Contenedor 20ft",
							quantity: 1,
							weight: 0,
							unitWeight: "KG",
							unitDimensions: "CM",
							length: 0,
							width: 0,
							height: 0,
						})
					}
				>
					<i className='fa-solid fa-plus'></i>
				</button>
			</div>

			{searchType === "aereo" && (
				<div className='form-group'>
					<div className='form-input full'>
						<label htmlFor=''>fecha de preparación de la carga</label>
						<input
							min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
							{...register(`date`, {
								required: "La fecha es obligatoria",

								validate: (value: any) => {
									console.log("Validando fecha:", value);

									const selectedDate = new Date(value);
									const today = new Date();
									today.setHours(0, 0, 0, 0); // Limpiar hora

									if (selectedDate <= today) {
										return "La fecha debe ser mayor a hoy";
									}

									return true;
								},
							})}
							type='date'
						></input>
					</div>
					{errors.date && (
						<p className='text-red-500 text-sm mt-1'>{errors.date.message}</p>
					)}
				</div>
			)}
		</>
	);
}
export default CargoSelector;
