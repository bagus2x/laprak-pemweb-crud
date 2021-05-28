import React, { ChangeEvent, FormEvent, useState } from 'react';
import { v4 as uuid } from 'uuid';
import './App.css';

interface Mahasiswa {
	_id: string;
	firstName: string;
	lastName: string;
	sks: number;
}

const initialState: Array<Mahasiswa> = [
	{ _id: uuid(), firstName: 'Tubagus', lastName: 'Saifulloh', sks: 24 },
	{ _id: uuid(), firstName: 'Burhan', lastName: 'Saifudin', sks: 24 }
];

interface MhsDetail {
	onClose: () => void;
	data: Mahasiswa;
}

const MhsDetailDialog = ({ data, onClose }: MhsDetail) => {
	return (
		<div className="back-drop" onClick={onClose}>
			<div className="dialog" onClick={(ev) => ev.stopPropagation()}>
				<div className="avatar-wrapper">
					<img className="avatar" src={`https://avatars.dicebear.com/v2/male/${data._id}.svg`} alt="" />
				</div>
				<div className="profile">
					<span>First name</span>
					<span>{data.firstName}</span>
					<span>Last name</span>
					<span>{data.lastName}</span>
					<span>Sks</span>
					<span>{data.sks}</span>
				</div>
			</div>
		</div>
	);
};

interface MhsFormDialogProps {
	onClose: () => void;
	setData: React.Dispatch<React.SetStateAction<Mahasiswa[]>>;
	data?: Mahasiswa;
}

const MhsFormDialog = ({ onClose, data, setData }: MhsFormDialogProps) => {
	const [field, setField] = useState<Mahasiswa>(data || { _id: '', firstName: '', lastName: '', sks: 0 });

	const handleSubmit = (ev: FormEvent) => {
		ev.preventDefault();
		if (data) setData((prev) => prev.map((mhs) => (mhs._id === data._id ? { ...field, _id: mhs._id } : mhs)));
		else setData((prev) => [{ ...field, _id: uuid() }, ...prev]);
		handleClose();
	};

	const handleInput = (ev: ChangeEvent<HTMLInputElement>) => {
		setField((prev) => ({ ...prev, [ev.target.name]: ev.target.value }));
	};

	const handleClose = () => {
		onClose();
	};

	return (
		<div className="back-drop">
			<div className="dialog">
				<form onSubmit={handleSubmit}>
					<input name="firstName" type="text" placeholder="First name" value={field.firstName} onChange={handleInput} />
					<input name="lastName" type="text" placeholder="Last name" value={field.lastName} onChange={handleInput} />
					<input name="sks" type="number" placeholder="SKS" value={field.sks} onChange={handleInput} />
					<div className="btn-wrapper">
						<button className="btn-cancel" onClick={handleClose}>
							Cancel
						</button>
						<button type="submit" className="btn-add">
							{data ? 'Update' : 'Add'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

function App() {
	const [data, setData] = useState(initialState);
	const [adding, setAdding] = useState(false);
	const [editing, setEditting] = useState('');
	const [show, setShow] = useState('');

	return (
		<div>
			<button className="btn-add" onClick={() => setAdding(true)}>
				Add Mahasiswa
			</button>
			{adding && <MhsFormDialog onClose={() => setAdding(false)} setData={setData} />}
			<table>
				<thead>
					<tr>
						<td>No.</td>
						<td>First Name</td>
						<td>Last Name</td>
						<td>SKS</td>
						<td>Action</td>
					</tr>
				</thead>
				<tbody>
					{data.map((mhs, index) => (
						<tr key={mhs._id}>
							<td>{index + 1}</td>
							<td>{mhs.firstName}</td>
							<td>{mhs.lastName}</td>
							<td>{mhs.sks}</td>
							<td className="col-action">
								<button className="btn-show" onClick={() => setShow(mhs._id)}>
									Show
								</button>
								{show === mhs._id && <MhsDetailDialog data={mhs} onClose={() => setShow('')} />}
								<button className="btn-edit" onClick={() => setEditting(mhs._id)}>
									Edit
								</button>
								<button onClick={() => setData((prev) => prev.filter((m) => m._id !== mhs._id))} className="btn-delete">
									Delete
								</button>
								{editing === mhs._id && <MhsFormDialog onClose={() => setEditting('')} setData={setData} data={mhs} />}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default App;
