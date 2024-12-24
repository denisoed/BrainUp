const useFormaters = () => {
  function formatNumberWithSpaces(num: number) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  return { formatNumberWithSpaces }
}

export default useFormaters