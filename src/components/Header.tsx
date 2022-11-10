import { useContracts } from "@/hooks/useContracts";
import { useModal } from "@/hooks/useModal";
import { useWeb3 } from "@/hooks/useWeb3";
import { Bars3Icon } from "@heroicons/react/24/outline";
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
        <button className="btn btn-sm btn-outline btn-error flex-1">
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

  return (
    <>
      <ShareLinkModal sharedId={sharedId} {...register} />
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
            className="btn btn-ghost justify-start normal-case"
            onClick={() => console.log(saveSpace())}
          >
            Save as JSON
          </button>
          <button className="btn btn-ghost relative justify-start normal-case">
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
            className="btn btn-ghost justify-start normal-case"
            onClick={() =>
              shareSpace().then(setSharedId).then(onClose).then(openModal)
            }
          >
            Share This Space
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
