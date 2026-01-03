import './style.css';

const agendaData = [
    {
        time: "10:00 AM",
        status: "Completed",
        title: "Opening Greetings",
        description: "National Anthem,<br>State Anthem<br>Welcome Address",
        type: "simple"
    },
    {
        time: "10:10 AM",
        status: "Completed",
        title: "Opening Address",
        description: "Building a Digital Economy for Sustainable Growth in Ogun State",
        type: "simple"
    },
    {
        time: "10:20 AM",
        status: "Completed",
        tag: "Keynote",
        title: "Entrepreneurs Playbook – The Reality of Building for the African Market",
        speaker: {
            name: "Seye Bandele",
            role: "Founder • PaidHR",
            image: "https://ui-avatars.com/api/?name=Seye+Bandele&background=random" // Placeholder, ideally use real image
        },
        type: "detailed"
    },
    {
        time: "10:35 AM",
        status: "Completed",
        tag: "Panel",
        title: "Unlocking Opportunities in the Creative Economy",
        speaker: {
            name: "Ayo Adeagbo",
            role: "SA to the President • Art, Culture and Creative Economy",
            image: "https://ui-avatars.com/api/?name=Ayo+Adeagbo&background=random"
        },
        type: "detailed"
    }
];

const renderAgenda = () => {
    const container = document.getElementById('agenda-list');

    container.innerHTML = agendaData.map((item, index) => {
        const isDetailed = item.type === 'detailed';

        const delay = (index % 4) * 100;
        return `
      <div class="relative flex gap-6 animate-fade-in-up" style="animation-delay: ${delay}ms; opacity: 0;">
        <!-- Time Bubble -->
        <div class="flex-shrink-0 z-10">
            <div class="bg-gray-800 border border-gray-700 rounded-full px-3 py-1 text-xs font-medium text-gray-300 w-[85px] text-center transition-all duration-300 hover:scale-105">
                ${item.time}
            </div>
        </div>

        <!-- Content -->
        <div class="flex-grow pb-8">
            <div class="flex items-center justify-between mb-2">
                <span class="bg-gray-800 text-gray-400 text-[10px] font-medium px-3 py-1 rounded-full border border-gray-700 transition-all duration-300 hover:scale-105">
                    ${item.status}
                </span>
                ${item.tag ? `
                <span class="bg-gray-800 text-gray-400 text-[10px] font-medium px-3 py-1 rounded-full border border-gray-700 transition-all duration-300 hover:scale-105">
                    ${item.tag}
                </span>
                ` : ''}
            </div>

            <h3 class="text-base font-bold text-white mb-1 leading-tight transition-colors duration-300 hover:text-red-500">
                ${item.title}
            </h3>

            ${!isDetailed ? `
                <p class="text-xs text-gray-400 leading-relaxed">
                    ${item.description}
                </p>
            ` : ''}

            ${isDetailed && item.speaker ? `
                <div class="mt-3 border border-gray-700 rounded-2xl p-3 flex items-center gap-3 shadow-sm bg-gray-800 transition-all duration-300 hover:border-gray-600 hover:shadow-md hover:-translate-y-1">
                    <img src="${item.speaker.image}" alt="${item.speaker.name}" class="w-10 h-10 rounded-full object-cover bg-gray-700 transition-transform duration-300 hover:scale-110">
                    <div>
                        <p class="text-sm font-bold text-white">${item.speaker.name}</p>
                        <p class="text-[10px] text-gray-400">${item.speaker.role}</p>
                    </div>
                </div>
            ` : ''}
        </div>
      </div>
    `;
    }).join('');
};

document.addEventListener('DOMContentLoaded', renderAgenda);
