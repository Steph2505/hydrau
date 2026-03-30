    (function(){
      emailjs.init({ publicKey: "N469QWuQ0w5xk269j" });
    })();
      // ── Modal open / close ────────────────────────────────────────
  function openDevisModal() {
    var modal = document.getElementById('devisModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
 
  function closeDevisModal() {
    var modal = document.getElementById('devisModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
 
  function handleModalOverlayClick(e) {
    if (e.target === document.getElementById('devisModal')) {
      closeDevisModal();
    }
  }
 
  // Fermer avec Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeDevisModal();
  });
    function toggleServiceDetails(button) {
      var card = button.closest('.service-card');
      var details = card.querySelector('.service-details');
      document.querySelectorAll('.service-details.expanded').forEach(function(openDetails) {
        if (openDetails !== details) {
          openDetails.classList.remove('expanded');
          var otherBtn = openDetails.closest('.service-card').querySelector('.service-btn');
          if (otherBtn) otherBtn.textContent = 'En savoir plus';
        }
      });
      if (details.classList.contains('expanded')) {
        details.classList.remove('expanded');
        button.textContent = 'En savoir plus';
      } else {
        details.classList.add('expanded');
        button.textContent = 'Réduire';
        setTimeout(function() { details.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 300);
      }
    }

    $(document).ready(function () {
      $(window).scroll(function () {
        $('#header').toggleClass('scrolled', $(this).scrollTop() > 50);
      });

      var menuToggle = $('#menuToggle');
      var mobileNav = $('#mobileNav');
      menuToggle.click(function () {
        menuToggle.toggleClass('active');
        mobileNav.toggleClass('active');
      });
      $('a[href^="#"]').click(function () {
        if (mobileNav.hasClass('active')) {
          menuToggle.removeClass('active');
          mobileNav.removeClass('active');
        }
      });

      var animationQueue = [];
      var isAnimating = false;
      function handleScroll() {
        var elements = document.querySelectorAll('.animate, .animate-left, .animate-right, .animate-bounce, .animate-slide-bounce');
        var isMobile = window.innerWidth <= 768;
        var isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
        elements.forEach(function(el, index) {
          var elementPosition = el.getBoundingClientRect().top;
          var screenPosition = window.innerHeight * 0.8;
          if (elementPosition < screenPosition && !el.classList.contains('animated') && !el.classList.contains('queued')) {
            el.classList.add('queued');
            var baseDelay = 0, staggerDelay = 0;
            if (isMobile) { baseDelay = Math.floor(index / 6) * 300; staggerDelay = (index % 6) * 150; }
            else if (isTablet) { baseDelay = Math.floor(index / 4) * 200; staggerDelay = (index % 4) * 100; }
            else { baseDelay = Math.floor(index / 5) * 150; staggerDelay = (index % 5) * 80; }
            animationQueue.push({ element: el, timestamp: Date.now() + baseDelay + staggerDelay });
          }
        });
        animationQueue.sort(function(a,b){ return a.timestamp - b.timestamp; });
        processAnimationQueue();
      }
      function processAnimationQueue() {
        if (isAnimating || animationQueue.length === 0) return;
        isAnimating = true;
        var now = Date.now();
        var ready = animationQueue.filter(function(i){ return i.timestamp <= now; });
        if (ready.length > 0) {
          ready.forEach(function(item){
            setTimeout(function(){ item.element.classList.remove('queued'); item.element.classList.add('animated'); }, Math.random()*50);
          });
          animationQueue = animationQueue.filter(function(i){ return i.timestamp > now; });
        }
        isAnimating = false;
        if (animationQueue.length > 0) requestAnimationFrame(processAnimationQueue);
      }
      var ticking = false;
      window.addEventListener('scroll', function(){ if(!ticking){ requestAnimationFrame(function(){ handleScroll(); ticking=false; }); ticking=true; } }, { passive: true });
      handleScroll();

      var backToTop = $('#backToTop');
      $(window).scroll(function(){ backToTop.toggleClass('show', $(this).scrollTop() > 200); });
      backToTop.click(function(){ $('html, body').animate({ scrollTop: 0 }, 800); });

      $('a[href^="#"]').click(function(e) {
        var target = $(this.getAttribute('href'));
        if (target.length) { $('html, body').animate({ scrollTop: target.offset().top - 63 }, 800); }
      });

      function initAutoScroll(selector, stepPx, intervalMs) {
        var $el = $(selector);
        if (!$el.length) return;
        setInterval(function () {
          var el = $el[0];
          var max = el.scrollWidth - el.clientWidth;
          if (max <= 0) return;
          var atEnd = Math.ceil(el.scrollLeft) >= Math.floor(max) - 1;
          if (atEnd) { $el.animate({ scrollLeft: 0 }, 500); }
          else { var next = el.scrollLeft + stepPx; if (next > max) next = max; $el.animate({ scrollLeft: next }, 500); }
        }, intervalMs);
      }

      initAutoScroll('#portfolioGrid',    260, 4000);
      initAutoScroll('#referencesGrid',   260, 3500);
      initAutoScroll('#testimonialsGrid', 360, 4500);

      $('#devisS').closest('form').submit(function(e) {
          e.preventDefault();
      
          var name    = $('#name').val();
          var email   = $('#email').val();
          var phone   = $('#phone').val();
          var message = $('#message').val();
      
          var btn        = document.getElementById('devisS');
          var formMsg    = document.getElementById('form-message');
      
          // Validation
          if (!name || !email || !phone || !message) {
            $(formMsg)
              .html('<i class="fa fa-times-circle" style="margin-right:6px;"></i>Veuillez remplir tous les champs obligatoires.')
              .show()
              .css('color', '#F94C4C');
            return;
          }
      
          // Feedback visuel — envoi en cours
          btn.disabled = true;
          btn.innerHTML = '<i class="fa fa-spinner fa-spin" style="margin-right:8px;"></i>Envoi en cours…';
          $(formMsg).hide();
      
          // Envoi via EmailJS
          // Les variables du template doivent correspondre aux attributs name= du formulaire :
          //   {{name}}    →  input name="name"
          //   {{email}}   →  input name="email"
          //   {{phone}}   →  input name="phone"
          //   {{message}} →  textarea name="message"
          emailjs.sendForm('service_mkhqtjj', 'template_u4vg5gd', e.target)
            .then(function() {
              // Succès
              btn.innerHTML = '<i class="fa fa-check" style="margin-right:8px;"></i>Message envoyé !';
              btn.style.background = 'linear-gradient(135deg,#4CAF50,#2e7d32)';
      
              $(formMsg)
                .html('<i class="fa fa-check-circle" style="margin-right:6px;"></i>Message envoyé ! Nous vous recontacterons bientôt.')
                .show()
                .css('color', '#4CAF50');
      
              $('form')[0].reset();
      
              // Réinitialiser le bouton après 4s
              setTimeout(function() {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa fa-paper-plane" style="margin-right:8px;"></i>Envoyer le message';
                btn.style.background = '';
                $(formMsg).fadeOut();
              }, 4000);
      
            }, function(error) {
              // Échec
              btn.disabled = false;
              btn.innerHTML = '<i class="fa fa-paper-plane" style="margin-right:8px;"></i>Envoyer le message';
      
              $(formMsg)
                .html('<i class="fa fa-times-circle" style="margin-right:6px;"></i>Erreur d\'envoi. Réessayez ou appelez-nous directement.')
                .show()
                .css('color', '#F94C4C');
      
              console.error('EmailJS error:', error);
            });
        });
    });