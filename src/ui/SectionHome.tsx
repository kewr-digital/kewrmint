import {
  ArrowRightIcon,
  ServerIcon,
  EyeIcon,
  SparklesIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";
import LogoAtone from "../assets/atomone-logo.png";
import LogoPhoton from "../assets/photon-logo.png";

function SectionHome() {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-cyan-300/5 rounded-full blur-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
          {/* Announcement Badge */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-full text-white text-sm font-medium backdrop-blur-sm">
              <SparklesIcon className="h-4 w-4 mr-2" />
              22Node raises infrastructure for AtomOne Network
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.85] tracking-tight">
              Our node,
              <br />
              your universe.
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium">
              AtomOne infrastructure from 22Node - your trusted node operator.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
            <Link
              to="/mint"
              className="bg-cyan-500 text-black font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:bg-cyan-400 flex items-center justify-center gap-2"
            >
              <img src={LogoPhoton} alt="PHOTON" className="w-5 h-5" />
              Mint Photon
            </Link>
            <Link
              to="/explorer"
              className="text-white font-medium py-4 px-8 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 flex items-center justify-center gap-2 bg-gray-800/50 backdrop-blur-sm"
            >
              See explorer
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Infrastructure */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <ServerIcon className="h-12 w-12 text-cyan-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Reliable Infrastructure
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                High-performance RPC, REST, and gRPC endpoints for seamless
                AtomOne integration.
              </p>
              <div className="space-y-2 text-sm text-gray-400">
                <div>• rpc-atomone.22node.xyz</div>
                <div>• rest-atomone.22node.xyz</div>
                <div>• gRPC Protocol Buffers</div>
              </div>
            </div>

            {/* PHOTON Minting */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <img src={LogoPhoton} alt="PHOTON" className="w-12 h-12 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                PHOTON Minting
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Easy-to-use interface for minting PHOTON tokens directly from
                our platform.
              </p>
              <Link
                to="/mint"
                className="inline-flex items-center text-cyan-400 font-medium hover:text-cyan-300 transition-colors duration-200"
              >
                Start minting
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {/* Network Explorer */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <EyeIcon className="h-12 w-12 text-cyan-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Network Explorer
              </h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Real-time blockchain data and transaction monitoring for AtomOne
                network.
              </p>
              <Link
                to="/explorer"
                className="inline-flex items-center text-cyan-400 font-medium hover:text-cyan-300 transition-colors duration-200"
              >
                Explore network
                <ArrowRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* AtomOne Section */}
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
            Built for AtomOne ecosystem
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
            22Node operates reliable node infrastructure and provides public
            endpoints to support the AtomOne ecosystem with enterprise-grade
            infrastructure services.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/mint"
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 text-center group"
            >
              <img
                src={LogoPhoton}
                alt="PHOTON"
                className="w-10 h-10 mx-auto mb-4"
              />
              <h4 className="text-white font-semibold mb-2">PHOTON</h4>
              <p className="text-gray-400 text-sm">Fee token minting</p>
            </Link>

            <Link
              to="/explorer"
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 text-center group"
            >
              <EyeIcon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Explorer</h4>
              <p className="text-gray-400 text-sm">Blockchain data</p>
            </Link>

            <Link
              to="/docs"
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 text-center group"
            >
              <DocumentTextIcon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Docs</h4>
              <p className="text-gray-400 text-sm">Developer guide</p>
            </Link>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 text-center group">
              <img
                src={LogoAtone}
                alt="ATONE"
                className="w-10 h-10 mx-auto mb-4"
              />
              <h4 className="text-white font-semibold mb-2">AtomOne</h4>
              <p className="text-gray-400 text-sm">Core network</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionHome;
