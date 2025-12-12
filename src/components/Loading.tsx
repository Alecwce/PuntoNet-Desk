import { Icon } from "./Icon";

export const Loading = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-center">
        <Icon
          name="hourglass_empty"
          className="text-6xl text-gray-400 animate-pulse"
        />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando...</p>
      </div>
    </div>
  );
};
