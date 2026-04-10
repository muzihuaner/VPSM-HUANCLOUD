/**
 * IDC 云服务首页 - Material Design 3 风格
 * 功能：平滑滚动、导航栏交互、滚动动画、回到顶部
 */

(function () {
  'use strict';

  // ========== 工具函数 ==========
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // ========== 平滑滚动 ==========
  function smoothScrollTo(targetEl) {
    if (!targetEl) return;
    const appBarHeight = $('#topAppBar')?.offsetHeight || 64;
    const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - appBarHeight;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }

  // 绑定所有锚点链接
  $$('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (target) {
        e.preventDefault();
        smoothScrollTo(target);
        // 关闭移动端抽屉
        closeDrawer();
      }
    });
  });

  // ========== 顶部导航栏滚动效果 ==========
  const topAppBar = $('#topAppBar');
  const scrollTopFab = $('#scrollTopFab');

  function handleScroll() {
    const scrolled = window.scrollY > 10;
    topAppBar.classList.toggle('top-app-bar--scrolled', scrolled);

    // 回到顶部 FAB 显隐
    const showFab = window.scrollY > 400;
    scrollTopFab.classList.toggle('md3-fab--visible', showFab);

    // 高亮当前section对应的导航链接
    highlightNavLink();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // ========== 导航链接高亮 ==========
  function highlightNavLink() {
    const sections = ['#home-products', '#solutions', '#contact', '#about'];
    const appBarHeight = topAppBar?.offsetHeight || 64;
    let currentSection = '';

    sections.forEach((id) => {
      const section = $(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        
        // 当section进入视口范围内时高亮
        if (sectionTop <= appBarHeight + 150 && sectionBottom > appBarHeight) {
          currentSection = id;
        }
      }
    });

    // 如果没有任何section在视口内，默认高亮第一个
    if (!currentSection && window.scrollY < 200) {
      currentSection = '#home-products';
    }

    $$('.top-app-bar__link').forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('top-app-bar__link--active', href === currentSection);
    });

    $$('.nav-drawer__item[data-nav]').forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('nav-drawer__item--active', href === currentSection);
    });
  }

  // ========== 移动端抽屉导航 ==========
  const menuBtn = $('#menuBtn');
  const navDrawer = $('#navDrawer');
  const drawerScrim = $('#drawerScrim');

  function openDrawer() {
    navDrawer.classList.add('open');
    menuBtn.innerHTML = '<span class="material-icons-round">close</span>';
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    menuBtn.innerHTML = '<span class="material-icons-round">menu</span>';
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', () => {
    if (navDrawer.classList.contains('open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerScrim?.addEventListener('click', closeDrawer);

  // ========== 回到顶部 ==========
  scrollTopFab.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ========== 滚动入场动画 (Intersection Observer) ==========
  const animateOnScroll = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section__content--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    $$('.section__container').forEach((container) => {
      observer.observe(container);
    });

    // 卡片逐个入场
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.md3-card');
            cards.forEach((card, index) => {
              card.style.transitionDelay = `${index * 80}ms`;
              card.classList.add('md3-card--visible');
            });
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    $$('.product-grid, .solutions-grid, .contact-grid, .about-grid__features').forEach((grid) => {
      cardObserver.observe(grid);
    });
  };

  // ========== 页脚年份 ==========
  function setFooterYear() {
    const yearEl = $('#footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // ========== 初始化 ==========
  window.addEventListener('DOMContentLoaded', () => {
    handleScroll();
    animateOnScroll();
    setFooterYear();
  });
})();
