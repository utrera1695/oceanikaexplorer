import "assets/styles/modal.scss";

const Modal = ({ isOpen, onClose, children }: any) => {
	if (!isOpen) return null;

	return (
		<div className='overlay'>
			<div className='modal'>
				<button onClick={onClose} className='close-button'>
					<i className='fa-regular fa-circle-xmark'></i>
				</button>
				{children}
			</div>
		</div>
	);
};

export default Modal;
