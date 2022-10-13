import { useContracts } from "@/hooks/useContracts";
import { ContractData } from "@/state/contract/types";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const ContractInput = () => {
  const { register, handleSubmit, setValue } = useForm<ContractData>();
  const [loading, setIsLoading] = useState(false);
  const { loadContract, contractData } = useContracts();

  const callLoadContract = useCallback(
    (data: ContractData) => {
      setIsLoading(true);
      loadContract(data).finally(() => setIsLoading(false));
    },
    [loadContract]
  );

  useEffect(() => {
    setValue("tag", contractData?.tag || "");
    setValue("address", contractData?.address || "");
    setValue("abi", contractData?.abi || "");
    setValue("backProxy", contractData?.backProxy || false);
  }, [contractData, setValue]);

  return (
    <form
      className="flex w-full flex-col gap-2"
      onSubmit={handleSubmit(callLoadContract)}
    >
      <input
        className="input text-lg shadow-lg"
        type="text"
        placeholder="Tag"
        {...register("tag", { required: true })}
      />
      <input
        className="input text-lg shadow-lg"
        type="text"
        placeholder="Contract Address"
        {...register("address", { required: true })}
      />

      <textarea
        className="input h-56 resize-none py-2 text-lg shadow-lg"
        placeholder="Contract Abi (optional)"
        {...register("abi", { required: false })}
      />
      <div className="bg-base-100 card rounded-lg px-2 shadow-lg">
        <label className="label cursor-pointer">
          <span className="text-lg font-bold">Read beyond the proxy</span>
          <input
            type="checkbox"
            className="checkbox"
            {...register("backProxy", { required: false })}
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={loading}
        className={clsx("btn", loading && "loading")}
      >
        Load
      </button>
    </form>
  );
};
