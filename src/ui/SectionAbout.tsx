import {
  ServerIcon,
  ShieldCheckIcon,
  ClockIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import LogoAtone from "../assets/atomone-logo.png";

function SectionAbout() {
  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-2/3 right-1/2 w-64 h-64 bg-cyan-300/5 rounded-full blur-2xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
              About 22Node
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
              We are a dedicated infrastructure provider for the AtomOne
              ecosystem, committed to delivering reliable, high-performance node
              services.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                To provide enterprise-grade infrastructure services that empower
                developers and users in the AtomOne ecosystem. We believe in
                decentralization, reliability, and accessibility.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <ShieldCheckIcon className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      Security First
                    </h4>
                    <p className="text-gray-400">
                      Enterprise-grade security measures to protect your
                      transactions and data.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <ClockIcon className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      99.9% Uptime
                    </h4>
                    <p className="text-gray-400">
                      Reliable infrastructure with minimal downtime and maximum
                      performance.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <GlobeAltIcon className="h-6 w-6 text-cyan-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-2">
                      Global Access
                    </h4>
                    <p className="text-gray-400">
                      Worldwide accessibility with optimized endpoints for best
                      performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
              <img
                src={LogoAtone}
                alt="AtomOne"
                className="w-16 h-16 mx-auto mb-6"
              />
              <h3 className="text-2xl font-bold text-white mb-4 text-center">
                AtomOne Ecosystem
              </h3>
              <p className="text-gray-300 leading-relaxed text-center mb-6">
                Supporting the next generation of blockchain infrastructure with
                cutting-edge technology and unwavering commitment.
              </p>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-cyan-400">24/7</div>
                  <div className="text-sm text-gray-400">Monitoring</div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="text-2xl font-bold text-cyan-400">100%</div>
                  <div className="text-sm text-gray-400">Dedicated</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              What We Provide
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive infrastructure services designed to support the
              AtomOne ecosystem.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
              <ServerIcon className="h-12 w-12 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">
                RPC Endpoints
              </h3>
              <p className="text-gray-300 leading-relaxed">
                High-performance RPC endpoints for seamless blockchain
                interactions and application development.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
              <CpuChipIcon className="h-12 w-12 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">REST API</h3>
              <p className="text-gray-300 leading-relaxed">
                RESTful API services for easy integration with existing
                applications and services.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
              <GlobeAltIcon className="h-12 w-12 text-cyan-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-4">
                gRPC Services
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Protocol Buffer-based gRPC services for efficient, type-safe
                communication.
              </p>
            </div>
          </div>
        </div>

        {/* Team Values */}
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">
              Our Values
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
                <ShieldCheckIcon className="h-10 w-10 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Reliability</h3>
              <p className="text-gray-300 leading-relaxed">
                We prioritize consistent, dependable service that you can trust
                for your critical applications.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
                <UserGroupIcon className="h-10 w-10 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Community</h3>
              <p className="text-gray-300 leading-relaxed">
                Supporting the AtomOne community with transparent, accessible
                infrastructure services.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 border border-gray-700/50">
                <CpuChipIcon className="h-10 w-10 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-gray-300 leading-relaxed">
                Continuously improving our services with the latest technology
                and best practices.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
              Ready to Build?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Start using our infrastructure services today and join the AtomOne
              ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://rpc-atomone.22node.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500 text-black font-semibold py-3 px-6 rounded-xl transition-all duration-200 hover:bg-cyan-400"
              >
                Access RPC
              </a>
              <a
                href="https://rest-atomone.22node.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium py-3 px-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 bg-gray-800/50 backdrop-blur-sm"
              >
                REST API
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SectionAbout;
