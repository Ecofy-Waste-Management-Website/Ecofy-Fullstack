import { FaShieldAlt, FaBook, FaUsers, FaMapMarkerAlt } from 'react-icons/fa'

export default function Excellence() {
  const features = [
    {
      icon: <FaShieldAlt className="text-teal text-xl mb-3" />,
      title: 'Safe Environment',
      body: 'State-of-the-art security and child-proofed zones designed for worry-free exploration.'
    },
    {
      icon: <FaBook className="text-teal text-xl mb-3" />,
      title: 'Early Learning',
      body: 'A curriculum that blends Montessori and Reggio Emilia approaches for balanced growth.'
    },
    {
      icon: <FaUsers className="text-teal text-xl mb-3" />,
      title: 'Trusted Staff',
      body: 'Certified educators who are passionate about early childhood development and care.'
    },
    {
      icon: <FaMapMarkerAlt className="text-teal text-xl mb-3" />,
      title: 'Dubai Branches',
      body: "Conveniently located luxury centers across Dubai's most family-friendly neighbourhoods."
    }
  ]

  return (
    <section className="bg-sky-blue px-10 py-14">
      <h2 className="text-[22px] font-bold text-navy text-center">
        Excellence in Every Detail
      </h2>
      <p className="text-sm text-navy/75 mt-2 max-w-md mx-auto text-center leading-relaxed">
        Providing a holistic foundation that balances creative exploration
        with structured developmental milestones.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
            {feature.icon}
            <h3 className="font-bold text-sm text-navy mt-1">{feature.title}</h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{feature.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
