import Link from "next/link";

export const metadata = {
  title: "About | SciencePostmortems",
  description:
    "Learn about the SciencePostmortems platform and our mission to foster a better error culture in science.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-white shadow-sm rounded-lg p-8">
        <h1 className="text-3xl font-bold text-[#A43830] mb-6">
          About SciencePostmortems
        </h1>

        <div className="prose max-w-none text-[#333333]">
          <h2 className="text-xl font-semibold text-[#A43830] mt-8 mb-4">
            Our Mission
          </h2>
          <p>
            SciencePostmortems is a platform dedicated to sharing, discussing,
            and learning from mistakes in science. We believe that fostering a
            better error culture where mistakes are seen as opportunities to
            learn is essential for scientific progress.
          </p>

          <h2 className="text-xl font-semibold text-[#A43830] mt-8 mb-4">
            Why Error Culture Matters
          </h2>
          <p>
            In scientific research, mistakes are inevitable. However, these
            mistakes often remain hidden due to publication bias, career
            pressures, and a culture that stigmatizes failure. This prevents the
            scientific community from learning valuable lessons and leads to:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>Repeated errors across different research groups</li>
            <li>Wasted resources as others encounter the same pitfalls</li>
            <li>Missed opportunities for methodological improvements</li>
            <li>
              Psychological burden on researchers who feel isolated in their
              failures
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-[#A43830] mt-8 mb-4">
            How It Works
          </h2>
          <p>
            Our platform allows researchers to anonymously share their
            scientific mistakes, what went wrong, why it happened, and most
            importantly, what they learned from the experience. Each report is
            structured to highlight:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              <strong>Description:</strong> What happened
            </li>
            <li>
              <strong>Reason:</strong> Why it happened
            </li>
            <li>
              <strong>Learning:</strong> What can be learned from this
              experience
            </li>
          </ul>

          <p className="mt-4">
            Community members can comment on reports, share their own similar
            experiences, and subscribe to categories relevant to their field of
            research.
          </p>

          <h2 className="text-xl font-semibold text-[#A43830] mt-8 mb-4">
            Privacy and Anonymity
          </h2>
          <p>
            We understand the sensitivity of sharing mistakes, especially in
            competitive academic environments. Our platform is designed with
            privacy in mind:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-2">
            <li>
              All posts are anonymous, showing only optional job titles and
              fields of study
            </li>
            <li>
              Email addresses are used only for authentication and optional
              notifications
            </li>
            <li>No personal identifiers are displayed publicly</li>
          </ul>

          <h2 className="text-xl font-semibold text-[#A43830] mt-8 mb-4">
            Join Us
          </h2>
          <p className="mb-6">
            Whether you&apos;re a researcher, lab technician, professor, or
            student, your experiences matter. By sharing your scientific
            mistakes and what you learned from them, you contribute to a
            healthier research culture that embraces learning from failure.
          </p>

          <div className="flex justify-center mt-8">
            <Link
              href="/reports/new"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#A43830] hover:bg-[#8A2E27] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A43830]"
            >
              Share Your Experience
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
