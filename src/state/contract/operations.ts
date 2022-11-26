import { db } from "@/libs/firebase";
import { loadAbi } from "@/utils/loadAbi";
import { ethers } from "ethers";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useRecoilCallback, useRecoilState } from "recoil";
import { ProviderState } from "../web3";
import {
  ContractDataListState,
  ContractTagState,
  ContractToolDataStates,
} from "./atoms";
import { ToolDataSelector } from "./selector";
import { ContractData } from "./types";

export const useLoadContract = () => {
  const loadContract = useRecoilCallback(
    ({ set, snapshot }) =>
      async (data: ContractData) => {
        const providerLoadable = snapshot.getLoadable(ProviderState);
        const dataListLoadable = snapshot.getLoadable(ContractDataListState);
        const provider = providerLoadable.getValue();

        if (!data.abi && !provider) return;
        if (!data.abi) data.fuzzy = true;

        const abi =
          data.abi ||
          (await loadAbi(provider as ethers.providers.Provider, data.address, {
            backProxy: data.backProxy,
          }));

        set(ContractDataListState, {
          ...dataListLoadable.getValue(),
          [data.tag || ""]: { ...data, abi },
        });
        set(ContractTagState, data.tag);
      },
    []
  );
  return { loadContract };
};

export const useRemoveContract = () => {
  const removeContract = useRecoilCallback(
    ({ set, snapshot }) =>
      (tag: string) => {
        const dataListLoadable = snapshot.getLoadable(ContractDataListState);
        const dataList = dataListLoadable.getValue();
        const { [tag]: _, ...other } = dataList;
        set(ContractDataListState, {
          ...other,
        });
        set(ContractTagState, null);
      },
    []
  );
  return { removeContract };
};

export const useClearContract = () => {
  const clearContract = useRecoilCallback(
    ({ set }) =>
      () => {
        set(ContractTagState, null);
      },
    []
  );
  return { clearContract };
};

export const useToolData = () => {
  const [toolData, setToolData] = useRecoilState(ToolDataSelector);
  const setScript = (script: string) => setToolData({ ...toolData, script });
  const setByteCode = (byteCode: string) =>
    setToolData({ ...toolData, byteCode });
  return { toolData, setToolData, setScript, setByteCode };
};

export const useSaveSpace = () => {
  const getSpaceData = useRecoilCallback(({ snapshot }) => () => {
    const dataListLoadable = snapshot.getLoadable(ContractDataListState);
    const dataList = dataListLoadable.getValue();

    const toolDataList = Object.keys(dataList).reduce((result, tag) => {
      result[tag] = snapshot
        .getLoadable(ContractToolDataStates(tag))
        .getValue();
      return result;
    }, {} as Record<string, { byteCode: string; script: string }>);

    return {
      contractDataList: dataList,
      contractToolDataList: toolDataList,
    };
  });
  const saveSpace = () => {
    const spaceData = getSpaceData();
    const blob = new Blob([JSON.stringify(spaceData)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "space.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { getSpaceData, saveSpace };
};

export const useLoadSpace = () => {
  const loadSpace = useRecoilCallback(
    ({ set }) =>
      (
        spaceData: ReturnType<ReturnType<typeof useSaveSpace>["getSpaceData"]>
      ) => {
        set(ContractDataListState, spaceData.contractDataList);
        Object.keys(spaceData.contractToolDataList).forEach((tag) => {
          set(ContractToolDataStates(tag), spaceData.contractToolDataList[tag]);
        });
      },
    []
  );

  const loadSpaceFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const spaceData = JSON.parse(reader.result as string) as ReturnType<
        ReturnType<typeof useSaveSpace>["getSpaceData"]
      >;
      loadSpace(spaceData);
    };
    reader.readAsText(file);
  };

  return { loadSpace, loadSpaceFromFile };
};

export const useShareSpace = () => {
  const { getSpaceData } = useSaveSpace();
  const shareSpace = async () => {
    const spaceData = getSpaceData();
    const { id } = await addDoc(collection(db, "ctester"), spaceData);
    return id;
  };
  return { shareSpace };
};

export const useLoadSpaceFromShare = () => {
  const { loadSpace } = useLoadSpace();
  const loadSpaceFromShare = async (id: string) => {
    const snapshot = await getDoc(doc(db, "ctester", id));
    const spaceData = snapshot.data() as ReturnType<
      ReturnType<typeof useSaveSpace>["getSpaceData"]
    >;
    loadSpace(spaceData);
  };
  return { loadSpaceFromShare };
};
