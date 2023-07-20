import Error from './error.gif'

const ErrorMessage = () => {
  return (
    <img src={Error} alt="Картинка Ошибки" style={{width: '250px', objectFit: 'contain', margin: '0 auto', display: 'block'}} />
  )
}
export default ErrorMessage