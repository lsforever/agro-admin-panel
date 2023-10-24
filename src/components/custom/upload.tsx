// import { forwardRef, useState } from 'react'

// const UploadComponent = forwardRef<React.HTMLAttributes<HTMLDivElement>>(
//   ({ onChange, onBlur, name, label, methods }, ref) => {
//     const [fileName, setFileName] = useState('CLICK TO UPLOAD')

//     const handleChange = (e) => {
//       const newLabelName = e.target.files[0]?.name
//       newLabelName && setFileName(newLabelName)
//       onChange(e)
//     }

//     const handleDelete = (e) => {
//       e.preventDefault() //to avoid opening file window

//       //reset single value of a form
//       methods.setValue(name, '')
//       setFileName('CLICK AGAIN TO UPLOAD')
//     }

//     return (
//       <>
//         <label htmlFor='file-upload'>
//           <div>{fileName}</div>
//           <br />
//           <button onClick={(e) => handleDelete(e)}>Click to clear input</button>
//           <br />
//         </label>

//         <input
//           name={name}
//           id='file-upload'
//           style={{ display: 'none' }}
//           type='file'
//           ref={ref}
//           onChange={(e) => handleChange(e)}
//           multiple
//         />
//       </>
//     )
//   },
// )

// export default UploadComponent
