export const showVigenciaUpdate = (e) => {
  return e.lVigenteCsv == 1 ? (
    <h1 className=" font-bold bg-[#003462] text-white rounded-lg text-center">
      Actualizar
    </h1>
  ) : (
    <h1 className="font-bold bg-[#FF287A] text-white rounded-lg text-center">
      No Actualizar
    </h1>
  );
};

export const ShowVigencia = (e, dato) => {
  return e.lVigente == 1 ? (
    <h1 className=" font-bold bg-[#003462] text-white rounded-lg text-center">
      Vigente
    </h1>
  ) : (
    <h1 className="font-bold bg-[#FF287A] text-white rounded-lg text-center">
      No Vigente
    </h1>
  );
};
