<template>
  <h1>Home Page</h1>
</template>

<script lang="ts" setup></script>

<style scoped>
.coming-soon-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #371f84, #5c4d9f, #371f84);
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.floating-shapes {
  position: relative;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite linear;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  top: 60%;
  left: 80%;
  animation-delay: 5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 80%;
  left: 20%;
  animation-delay: 10s;
}

.shape-4 {
  width: 40px;
  height: 40px;
  top: 30%;
  left: 70%;
  animation-delay: 15s;
}

.shape-5 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 60%;
  animation-delay: 8s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

.logo-section {
  margin-bottom: 3rem;
}

.brand-name {
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  margin-bottom: 0.5rem;
  letter-spacing: 8px;
  animation: glow 2s infinite alternate;
}

.brand-tagline {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 3px;
  text-transform: uppercase;
}

@keyframes glow {
  from {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  }
  to {
    text-shadow: 0 0 30px rgba(255, 255, 255, 0.6);
  }
}

.coming-soon-text {
  margin-bottom: 3rem;
}

.coming-soon-text h2 {
  font-size: 2.5rem;
  color: #ffffff;
  margin-bottom: 1rem;
  font-weight: 300;
}

.coming-soon-text p {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.social-link i {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .brand-name {
    font-size: 2.5rem;
    letter-spacing: 4px;
  }

  .coming-soon-text h2 {
    font-size: 2rem;
  }
}
</style>
