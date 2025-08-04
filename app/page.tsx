'use client'

import { useState, useEffect } from 'react';

export default function Home() {
	type Todo = {
		title: string;
		desc: string;
		state: boolean;
	};
	const [todo, setTodo] = useState({ title: "", desc: "", state: false });
	const [list, setList] = useState<Todo[]>([]);

	useEffect(() => {
		let todos = localStorage.getItem("todos");
		if(todos) setList(JSON.parse(todos)[0]);
	}, []);

	const addTodo = () => {
		let todos = localStorage.getItem("todos");
		if (todos) {
			let todosJson = JSON.parse(todos);
			if (todosJson.filter(
				(value: Todo) => {
					return value.title == todo.title;
				}
			).length > 0) {
				alert("Todo with this title already exists");
			}
			else {
				todosJson.push(todo);
        		list.push(todo);
				localStorage
					.setItem("todos", JSON.stringify(todosJson));
				alert("Todo has been added");
				setTodo({ title: "", desc: "", state: false });
			}
		}
		else {
			localStorage.setItem("todos", JSON.stringify([todo]));
		}
	}

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTodo(
			{
				...todo,
				[e.target.name]: e.target.value
			}
		);
	}

	const done = (index: number) => {
		const tempList = [...list];
		tempList.splice(index, 1, {...tempList[index], state: true});
		setList(tempList);
		localStorage.setItem("todos", JSON.stringify([tempList]));
	}

	const deleteItem = (index: number) => {
		const tempList = [...list];
		tempList.splice(index, 1);
		setList(tempList);
		localStorage.setItem("todos", JSON.stringify([tempList]));
	}

	return (
		<div className=" text-3xl">
			<section className="text-gray-600 body-font">
				<div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
				<div className="rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 bg-slate-300 ">
				<h2 className="text-gray-900 text-lg font-medium title-font mb-5">
					Add a Todo
				</h2>
				<div className="relative mb-4">
					<label htmlFor="title"
						className="leading-7 text-sm 
							text-gray-600">
						Todo Title
					</label>
					<input onChange={onChange} value={todo.title} type="text" id="title" name="title"
						className="w-full bg-white rounded border border-gray-300
						focus:border-green-800 focus:ring-2 
						focus:ring-green-200 text-base outline-none
						text-gray-700 py-1 px-3
						leading-8 transition-colors duration-200 ease-in-out"
						autoComplete='false' />
				</div>
				<div className="relative mb-4">
					<label htmlFor="desc" className="leading-7 text-sm text-gray-600">
						Todo Description</label>
					<input onChange={onChange} value={todo.desc} type="text" id="desc" name="desc"
						className="w-full bg-white rounded border 
						border-gray-300 focus:border-green-800
					focus:ring-2 focus:ring-green-200 text-base 
					outline-none text-gray-700 py-1 px-3
					leading-8 transition-colors duration-200 ease-in-out" autoComplete='false' />
				</div>
				<button onClick={addTodo} className="text-white bg-green-800 border-0 py-2 px-8 focus:outline-none w-fit hover:bg-green-600 rounded text-lg">
					Add Todo
				</button>
			</div>
			<div className='p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 bg-green-100'>
				{list && list.map((item, index) => (
					<div className='w-full text-lg flex flex-row my-1' key={index}>
						<div className="w-1/12">
							{index + 1}
						</div>
						<div className="w-3/12">
							{item.title}
						</div>
						<div className="w-6/12">
							{item.desc}
						</div>
						<div className="w-2/12 flex flex-row justify-end">
							{item.state ? 
								<button 
									className="text-white bg-slate-300 border-0 px-5 focus:outline-none w-fit hover:bg-slate-300 rounded text-lg mr-1"
								>
									Done
								</button> :
								<button 
									onClick={() => {done(index)}}
									className="cursor-pointer text-white bg-slate-500 border-0 px-5 focus:outline-none w-fit hover:bg-slate-600 rounded text-lg mr-1"
								>
									Done
								</button>
							}
							
							<button 
								className="text-white bg-red-300 border-0 px-4 focus:outline-none w-fit hover:bg-red-400 rounded text-lg"
								onClick={() => {deleteItem(index)}}
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
				</div>
			</section>
		</div>
	)
}