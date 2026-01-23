import { FaBrain, FaLink, FaMobileAlt, FaTools, FaCogs, FaLeaf } from "react-icons/fa";

const futureScopeItems = [
  {
    title: "Technological Advancements",
    description: "Integrating advanced AI and machine learning algorithms can provide personalized problem recommendations, adaptive difficulty scaling, and automated code review to enhance user learning experiences.",
    icon: <FaBrain className="text-brand-orange" />,
    color: "from-brand-orange/20 to-brand-orange/5",
  },
  {
    title: "Blockchain Technology",
    description: "Leveraging blockchain can improve transparency and security in contest results, user achievements, and certification issuance, ensuring tamper-proof records and fair competition.",
    icon: <FaLink className="text-dark-blue-s" />,
    color: "from-dark-blue-s/20 to-dark-blue-s/5",
  },
  {
    title: "Mobile Applications",
    description: "Developing more intuitive and feature-rich mobile apps will enable users to solve problems, participate in contests, and track progress seamlessly on the go with real-time notifications and offline coding support.",
    icon: <FaMobileAlt className="text-dark-pink" />,
    color: "from-dark-pink/20 to-dark-pink/5",
  },
  {
    title: "Customization",
    description: "Offering tailored solutions for different user groups—such as students, professionals, and enterprise clients—can include specialized problem sets, company-branded contests, and integration with corporate training programs.",
    icon: <FaTools className="text-dark-yellow" />,
    color: "from-dark-yellow/20 to-dark-yellow/5",
  },
  {
    title: "Automation",
    description: "Employing automation for plagiarism detection, submission grading, and contest monitoring can improve accuracy, reduce manual workload, and maintain platform integrity.",
    icon: <FaCogs className="text-dark-green-s" />,
    color: "from-dark-green-s/20 to-dark-green-s/5",
  },
  {
    title: "Sustainability",
    description: "Optimizing server resources and promoting digital certifications can contribute to environmental sustainability by reducing energy consumption and minimizing physical paperwork.",
    icon: <FaLeaf className="text-olive" />,
    color: "from-olive/20 to-olive/5",
  },
];

export default function FutureScope() {
  return (
    <div className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Future <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-dark-yellow">Scope</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-brand-orange to-dark-yellow mx-auto rounded-full" />
          <p className="text-dark-gray-7 mt-6 max-w-2xl mx-auto">
            Our vision for the next generation of Code Hunger, pushing the boundaries of competitive programming and learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {futureScopeItems.map((item, index) => (
            <div
              key={index}
              className={`group relative p-8 rounded-2xl bg-dark-layer-1 border border-dark-divider-border-2 hover:border-brand-orange/30 transition-all duration-500 overflow-hidden`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-dark-layer-2 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-dark-divider-border-2 group-hover:border-brand-orange/30">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-brand-orange transition-colors">
                  {item.title}
                </h3>
                <p className="text-dark-gray-6 leading-relaxed group-hover:text-dark-gray-7 transition-colors">
                  {item.description}
                </p>
              </div>

              <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-brand-orange/10 to-transparent blur-2xl group-hover:bg-brand-orange/20 transition-all duration-500 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
