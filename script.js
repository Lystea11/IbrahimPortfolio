//CREATED BY: LYSANDRE STONE-BOURGEOIS (LYSTEA11)
//CREATED ON: 08/09/2024 (dd/mm/yyyy)
//LICENSE: MIT LICENSE

const lenis = new Lenis({
    duration: 1.2,  // Adjust scrolling duration (in seconds)
    smooth: true,
    direction: 'vertical',  // Scroll direction
    gestureDirection: 'vertical',
    smoothTouch: true,  // Enable smooth touch scrolling
    touchMultiplier: 2,  // Increase touch scrolling speed
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

const navbar = document.querySelector("header");

var options = {
    offset: 50
};

var headroom = new Headroom(navbar, options);

headroom.init();

gsap.registerPlugin(ScrollTrigger);

const navItems = document.querySelectorAll('nav ul li');
const careerCards = document.querySelectorAll('.career-card');
console.log(document.querySelectorAll('.career-card'));

navItems.forEach(item => {
    // Create hover background element
    const hoverBg = document.createElement('div');
    hoverBg.classList.add('hover-bg');
    item.appendChild(hoverBg);

    // GSAP hover animations for navigation items
    item.addEventListener('mouseenter', () => {
        gsap.to(item, {
            y: -3,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    item.addEventListener('mouseleave', () => {
        gsap.to(item, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// GSAP hover animations for career cards
careerCards.forEach(card => {
    console.log(card);
    card.addEventListener('mouseenter', () => {
        console.log("yo");
        gsap.to(card, {
            scale: 1.5,
            y: 50, // You can adjust this if needed
            duration: 0.3,
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});
// gsap.to("h1", {
//     opacity: 1,
//     y: 0,
//     duration: 1,
//     scrollTrigger: {
//         trigger: "h1",
//         start: "top 80%",
//     }
// });

gsap.utils.toArray(".project-card").forEach((card, index) => {
    gsap.to(card, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        delay: index * 0.2,
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
        }
    });
});

gsap.utils.toArray(".project-image").forEach((image) => {
    gsap.to(image, {
        scale: 1.05,
        duration: 4,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
    });
});

gsap.utils.toArray(".project-link").forEach((link) => {
    link.classList.add("floating");
});



// Matter.js module aliases
const { Engine, Render, Runner, World, Bodies, Common, Body, Events } = Matter;

// Create engine and renderer
const engine = Engine.create();
const render = Render.create({
    element: document.body,
    engine: engine,
    canvas: document.getElementById('physicsCanvas'),
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#ffffff'
    }
});

// Set gravity to zero
engine.world.gravity.y = 0;

// Function to generate random shapes
function createRandomShape() {
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    const size = Common.random(20, 50);
    const type = Math.floor(Common.random(0, 2)); // Ensure type is 0 or 1

    let shape;
    let x, y, velocityX, velocityY;

    // Randomly choose the side from which the shape will come
    const side = Math.floor(Common.random(0, 4)); // 0 = top, 1 = bottom, 2 = left, 3 = right

    switch (side) {
        case 0: // Top
            x = Common.random(canvasWidth);
            y = -size; // Start off-screen above the canvas
            velocityX = Common.random(-5, 5);
            velocityY = Common.random(5, 15);
            break;
        case 1: // Bottom
            x = Common.random(canvasWidth);
            y = canvasHeight + size; // Start off-screen below the canvas
            velocityX = Common.random(-5, 5);
            velocityY = Common.random(-15, -5);
            break;
        case 2: // Left
            x = -size; // Start off-screen to the left of the canvas
            y = Common.random(canvasHeight);
            velocityX = Common.random(5, 15);
            velocityY = Common.random(-5, 5);
            break;
        case 3: // Right
            x = canvasWidth + size; // Start off-screen to the right of the canvas
            y = Common.random(canvasHeight);
            velocityX = Common.random(-15, -5);
            velocityY = Common.random(-5, 5);
            break;
    }

    switch (type) {
        case 0:
            shape = Bodies.circle(x, y, size, {
                render: { fillStyle: Common.choose(["#FF6B6B","#FFE66D","#4ECDC4","#FF6F61", "#FF9F1C", "#2EC4B6", "#FFDFD3", "#FFD166"]) },
                restitution: 0.8
            });
            break;
        case 1:
            shape = Bodies.rectangle(x, y, size, size, {
                render: { fillStyle: Common.choose(["#FF6B6B","#FFE66D","#4ECDC4","#FF6F61", "#FF9F1C", "#2EC4B6", "#FFDFD3", "#FFD166"]) },
                restitution: 0.8
            });
            break;
    }

    // Set initial velocity to shoot the shape into the canvas
    Body.setVelocity(shape, {
        x: velocityX,
        y: velocityY
    });

    return shape;
}

// Add random shapes at intervals
function addRandomShapes() {
    const numShapes = 10;
    for (let i = 0; i < numShapes; i++) {
        World.add(engine.world, createRandomShape());
    }
}
function manageOverload(capacity) {
    const bodies = engine.world.bodies;
    if (bodies.length > capacity) {
        // Remove oldest bodies until the capacity is met
        while (bodies.length > capacity) {
            World.remove(engine.world, bodies[0]);
        }
    }
}
// Remove shapes that are out of bounds
function removeOutOfBoundsShapes() {
    const bounds = {
        xMin: -50, // Adjust as needed
        xMax: window.innerWidth + 50,
        yMin: -50, // Adjust as needed
        yMax: window.innerHeight + 50
    };
    setInterval(() => {
        manageOverload(30);
    }, 1000); // Check every second

    const bodies = engine.world.bodies; // Access bodies from engine.world

    bodies.forEach(body => {
        if (body.position.x < bounds.xMin ||
            body.position.x > bounds.xMax ||
            body.position.y < bounds.yMin ||
            body.position.y > bounds.yMax) {
            World.remove(engine.world, body, true);
        }
    });
}

// Run the engine and renderer
Engine.run(engine);
Render.run(render);
Runner.run(Runner.create(), engine);

// Slow down the simulation
engine.timing.timeScale = 0.1; // Adjust this value to slow down the simulation

// Add random shapes initially
addRandomShapes();

// Continuously add random shapes every 5 seconds
setInterval(addRandomShapes, 5000);

// Continuously remove out-of-bounds shapes
Events.on(engine, 'beforeUpdate', removeOutOfBoundsShapes);

// Handle resizing
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    Render.setSize(render, window.innerWidth, window.innerHeight);
});