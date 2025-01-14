const Caret = ({direction}) => {
    return <>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' className={direction}><path stroke='black' fill='black' d='M6 8l-1 1l5 5l5-5l-1-1l-4 4l-4-4z'/></svg>
    </>
}
export default Caret;