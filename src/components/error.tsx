import { useRouteError } from "react-router-dom";

const Error = () => {
  const error: any = useRouteError();
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-center text-6xl">Aiyyoo!</h1>
      <p className="text-center mt-4">An unexpected error has occurred.</p>
      <p className="border border-muted rounded-md p-4 text-center mt-6">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
};

export default Error;
