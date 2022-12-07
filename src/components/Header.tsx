import { useContracts } from "@/hooks/useContracts";
import { useModal } from "@/hooks/useModal";
import { useWeb3 } from "@/hooks/useWeb3";
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  BanknotesIcon,
  Bars3Icon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { ethers } from "ethers";
import { useState } from "react";
import { Drawer } from "./Drawer";
import { Modal, ModalProps } from "./Modal";

const ShareLinkModal: React.FC<ModalProps & { sharedId: string }> = ({
  sharedId,
  ...props
}) => {
  const shareUrl = `${location.protocol}//${location.host}?id=${sharedId}`;
  const copyUrl = () => {
    void navigator.clipboard.writeText(shareUrl);
  };
  return (
    <Modal className="flex flex-col gap-2 p-2" {...props}>
      <h2 className="text-xl font-bold">Generate a link for sharing!</h2>
      <button className="btn btn-ghost normal-case" onClick={copyUrl}>
        {shareUrl}
      </button>
      <div className="flex gap-2">
        <button className="btn btn-sm flex-1" onClick={copyUrl}>
          Copy
        </button>
        <button
          className="btn btn-sm btn-outline btn-error flex-1"
          onClick={props.onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

const DonateModal: React.FC<ModalProps> = (props) => {
  const { provider } = useWeb3();
  const [donateValue, setDonateValue] = useState("");
  const isValid = donateValue !== "" && !isNaN(Number(donateValue));
  const donate = () => {
    if (!provider) return;
    provider.getSigner().sendTransaction({
      to: "0x5b8172fd540A4A4443508F96F005cB970da5f40d",
      value: ethers.utils.parseEther(donateValue),
    });
  };

  return (
    <Modal className="flex flex-col gap-2 p-2" {...props}>
      <h2 className="text-3xl font-bold">Donate to inaridiy</h2>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Enter amount</span>
        </label>
        <label className="input-group">
          <input
            type="text"
            placeholder="0.01"
            className="input input-bordered w-full"
            value={donateValue}
            onChange={(e) => setDonateValue(e.target.value)}
          />
          <span>ETH</span>
        </label>
      </div>
      <div className="flex gap-2">
        <button disabled={!isValid} onClick={donate} className="btn flex-1">
          Donate
        </button>
        <button
          className="btn btn-outline btn-error flex-1"
          onClick={props.onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

const SideDrawer: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { connectWallet, provider } = useWeb3();
  const { saveSpace, loadSpaceFromFile, shareSpace } = useContracts();
  const [sharedId, setSharedId] = useState("");
  const { register, open: openModal } = useModal();
  const { register: donateRegister, open: openDonateModal } = useModal();

  return (
    <>
      <ShareLinkModal sharedId={sharedId} {...register} />
      <DonateModal {...donateRegister} />
      <Drawer open={open} onClose={onClose}>
        <div className="flex flex-col">
          {Boolean(provider) || (
            <div className="w-full border-b-2 p-2">
              <button className="btn w-full" onClick={connectWallet}>
                ConnectWallet
              </button>
            </div>
          )}

          <button
            className="btn btn-ghost gap-2 px-2 justify-start normal-case"
            onClick={() => console.log(saveSpace())}
          >
            <ArrowDownTrayIcon className="w-6" />
            Save as JSON
          </button>
          <button className="btn btn-ghost gap-2 px-2 relative justify-start normal-case">
            <ArrowUpTrayIcon className="w-6" />
            Load from JSON
            <input
              type="file"
              className="absolute inset-0 opacity-0"
              accept="application/json"
              onChange={(e) => {
                const file = e.target.files?.[0];
                file && loadSpaceFromFile(file);
              }}
            />
          </button>
          <button
            className="btn btn-ghost gap-2 px-2 justify-start normal-case"
            onClick={() =>
              shareSpace().then(setSharedId).then(onClose).then(openModal)
            }
          >
            <ShareIcon className="w-6" />
            Share This Space
          </button>
          <button
            className="btn btn-ghost gap-2 px-2 justify-start normal-case"
            onClick={openDonateModal}
          >
            <BanknotesIcon className="w-6" />
            Donate
          </button>
        </div>
      </Drawer>
    </>
  );
};

export const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SideDrawer open={open} onClose={() => setOpen(false)} />
      <header className="fixed z-10 w-full max-w-screen-lg">
        <nav className="navbar justify-between">
          <button className="btn btn-ghost px-2 text-lg normal-case sm:text-2xl">
            Contract Tester
          </button>
          <div className="flex-1"></div>
          <button
            className="btn btn-ghost btn-square"
            onClick={() => setOpen(true)}
          >
            <Bars3Icon className="w-10" />
          </button>
        </nav>
      </header>
    </>
  );
};
