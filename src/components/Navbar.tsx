import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  CommandLineIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router";
import { useKeplrWallet } from "../hooks/useKeplrWallet";

const navigation = [
  { name: "Mint", href: "/", current: false },
  { name: "Docs", href: "/docs", current: false },
];

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const {
    isConnected,
    address,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getShortAddress,
  } = useKeplrWallet();

  const handleWalletClick = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  const getButtonText = () => {
    if (isConnecting) return "Connecting...";
    if (isConnected && address) return getShortAddress(address);
    return "Connect Wallet";
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo - Always on the left */}
          <div className="flex shrink-0 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <CommandLineIcon className="h-8 w-8 text-cyan-400" />
              <div className="text-2xl font-bold text-cyan-400">Kewrmint</div>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden sm:flex sm:flex-1 sm:justify-center">
            <div className="flex space-x-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={classNames(
                      isActive
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "rounded-md px-3 py-2 text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Desktop Connect Wallet + Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Desktop Connect Wallet Button */}
            <button
              type="button"
              onClick={handleWalletClick}
              disabled={isConnecting}
              className={classNames(
                "hidden sm:block relative rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800",
                isConnected
                  ? "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500"
                  : "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500",
                isConnecting ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {getButtonText()}
            </button>

            {/* Mobile menu button - Always on the right */}
            <DisclosureButton className="sm:hidden group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block size-6 group-data-[open]:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden size-6 group-data-[open]:block"
              />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {/* Mobile Navigation Links */}
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={classNames(
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}

          {/* Mobile Connect Wallet Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleWalletClick}
              disabled={isConnecting}
              className={classNames(
                "w-full rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800",
                isConnected
                  ? "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500"
                  : "bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500",
                isConnecting ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
