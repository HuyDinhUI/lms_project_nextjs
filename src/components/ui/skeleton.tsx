export function SkeletonBoardsPage() {
  return (
    <div className="flex-1 min-h-screen pt-4 px-30">
      <div className={`h-5 w-2/5 animate-pulse bg-gray-200 rounded`}></div>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {Array.from({ length: 6 }).map((item, i) => (
          <div key={i} className="h-30 animate-pulse bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
}

export const SkeletonHeader = () => {
  return (
    <div className="flex px-3 py-2 items-center gap-5">
      <div className="w-[30%] h-10 animate-pulse bg-gray-200"></div>
      <div className="flex-1 h-10 animate-pulse bg-gray-200"></div>
      <div className="w-[25%] h-10 animate-pulse bg-gray-200"></div>
    </div>
  );
};

export const SkeletonBoardPage = () => {
  return (
    <div className="h-full">
      <div className="h-full flex flex-col">
        <div className="animate-pulse bg-gray-200 h-20"></div>
        <div className="flex-1">
          <div className="h-full p-5 grid grid-cols-5 gap-2">
            {Array.from({length: 5}).map((item, i) => (
              <div key={i} className={`animate-pulse bg-gray-200 h-${5 *(i+1)}`}></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
