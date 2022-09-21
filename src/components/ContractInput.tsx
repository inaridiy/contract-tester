import { useContracts } from "@/hooks/useContracts";
import { ContractData } from "@/state/contract/types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export const ContractInput = () => {
  const { register, handleSubmit, setValue } = useForm<ContractData>();
  const { loadContract, contractData } = useContracts();

  useEffect(() => {
    if (!contractData) return;
    setValue("tag", contractData.tag);
    setValue("address", contractData.address);
    setValue("abi", contractData.abi);
  }, [contractData, setValue]);

  return (
    <form
      className="flex w-full flex-col gap-2"
      onSubmit={handleSubmit(loadContract)}
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
        placeholder="Contract Abi"
        {...register("abi", { required: true })}
      />
      <button type="submit" className="btn">
        Load
      </button>
    </form>
  );
};
