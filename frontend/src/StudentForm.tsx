import { useState } from "react"

function StudentForm() {
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [age, setAge] = useState(0)
    
    console.log('StudentForm')

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('ID:', id)
        console.log('Name:', name)
        console.log('Age:', age)
    }
    return (
        <form className="m-3" onSubmit={onSubmit}>
            <div className="mb-3">
                <label htmlFor="id" className="form-label">ID:</label>
                <input type="text" id="id" name="id" className="form-control" onChange={(event) => { setId(event.target.value) }} />
            </div>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input type="text" id="name" name="name" className="form-control" onChange={(event) => { setName(event.target.value) }} />
            </div>
            <div className="mb-3">
                <label htmlFor="age" className="form-label">Age:</label>
                <input type="number" id="age" name="age" className="form-control" onChange={(event) => { setAge(Number(event.target.value)) }} />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    )
}

export default StudentForm