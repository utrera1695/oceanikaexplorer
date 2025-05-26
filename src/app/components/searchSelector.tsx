import { useEffect, useRef, useState } from "react";
import { useLocations } from "../../hooks/useLocations";

function SearchSelectorComponent({
	title,
	searchType,
	locationSelected,
	setLocationSelected,
}: {
	title: string;
	searchType: string;
	locationSelected: any;
	setLocationSelected: any;
}) {
	const { locations, loading, findLocation } = useLocations();
	const [inputValue, setValue] = useState("");
	const [showSelector, setShowSelector] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const divRef = useRef<HTMLDivElement>(null);

	const searchLocation = (e: any) => {
		setValue(e.target.value);

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			findLocation({
				searchType: searchType,
				term: e.target.value,
				type: "FCL",
			});
			setShowSelector(true);
			if (e.target.value !== locationSelected?.name) {
				setLocationSelected(null);
			}
		}, 500);
	};

	const selectLocation = (data: any) => {
		setValue(data.name);
		setLocationSelected(data);
		setShowSelector(false);
	};

	const focusInput = () => {
		if (locations) {
			setShowSelector(true);
		}
	};

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (divRef.current && !divRef.current.contains(event.target as Node)) {
				setShowSelector(false); // Oculta el div
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

	return (
		<div className='searchInput'>
			<label htmlFor=''>{title}</label>
			<span
				className={`selectedFlag fi fi-${locationSelected?.country.toLowerCase()}`}
			></span>
			{locationSelected?.defaultPostalCode && (
				<span className={`selectedZip`}>
					{locationSelected.defaultPostalCode}
				</span>
			)}
			<input
				onFocus={focusInput}
				onInput={searchLocation}
				value={inputValue}
			></input>
			{showSelector && (
				<div className='selector' ref={divRef}>
					{!loading ? (
						<div>
							{searchType === "maritimo" && (
								<>
									<p className='list-container'>Puertos maritimos</p>
									<ul>
										{locations &&
											locations?.ports.map((city) => (
												<li
													key={city.portIsoCode}
													onClick={() => selectLocation(city)}
												>
													<span>
														<div>
															{city.name}
															{city.state && <>, {city.state}</>}
														</div>
														<div className='country'>
															{regionNames.of(city.country)}
														</div>
													</span>
													<span
														className={`fi fi-${city.country.toLowerCase()}`}
													></span>
												</li>
											))}
									</ul>
								</>
							)}

							<p className='list-container'>Ciudades</p>
							<ul>
								{locations &&
									locations?.cities.map((city) => (
										<li
											key={`${city.country}-${city.defaultPostalCode}`}
											onClick={() => selectLocation(city)}
										>
											<span>
												<div>
													{city.name}, {city.state}
												</div>
												<div className='country'>
													{regionNames.of(city.country)}
												</div>
											</span>
											<span
												className={`fi fi-${city.country.toLowerCase()}`}
											></span>
										</li>
									))}
							</ul>
						</div>
					) : (
						<div>
							<p className='list-container'>Buscando</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
export default SearchSelectorComponent;
