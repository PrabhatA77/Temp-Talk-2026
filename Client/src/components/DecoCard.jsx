
const DecoCard = ({icon:Icon,heading,subHeading,point1,point2,point3}) => {
  return (
    <div className="flex flex-col border flex-1 justify-center items-center p-4 gap-4 h-[30vh] dark:border-white ">
      <div className="flex flex-col justify-center items-center gap-1">
        <Icon className="dark:text-white"/>
        <div className="text-3xl font-bold dark:text-white">{heading}</div>
        <div className="text-[14px] text-gray-400 font-bold">{subHeading}</div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center items-center gap-1">
          <div className="text-gray-500 dark:text-gray-200">{point1}</div>
        </div>
        
        <div className="flex justify-center items-center gap-1">
          
          <div className="text-gray-500 dark:text-gray-200">{point2}</div>
        </div>
        
        <div className="flex justify-center items-center gap-1">
          
          <div className="text-gray-500 dark:text-gray-200">{point3}</div>
        </div>
      </div>
    </div>
  )
}

export default DecoCard