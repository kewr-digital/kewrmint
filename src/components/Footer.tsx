import { CommandLineIcon } from "@heroicons/react/24/outline";

function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <CommandLineIcon className="h-8 w-8 text-cyan-400" />
              <h3 className="text-xl font-bold text-white">22Node</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              A decentralized application for minting PHOTON tokens on the
              AtomOne blockchain. Convert your ATONE tokens to PHOTON
              seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  Mint Photon
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://atom.one/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  AtomOne Official
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/atomone-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.keplr.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  Keplr Wallet
                </a>
              </li>
              <li>
                <a
                  href="https://cosmos.github.io/cosmjs/latest/stargate/modules.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  CosmJs
                </a>
              </li>
              <li>
                <a
                  href="https://atom.one/blog/atomone-v2-the-photon-powered-upgrade/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                >
                  Photon
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              <p>
                Maintained by{" "}
                <span className="text-cyan-400 font-semibold">
                  🇮🇩 Kewr Foundation
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
