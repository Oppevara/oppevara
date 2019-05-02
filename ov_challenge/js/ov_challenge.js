(function () {
  "use strict";
  if (!window.H5P) {
    return;
  }

  /**
  * @class
  * @augments H5P.EventDispatcher
  * @param {Object} instance H5P content instance
  */
  H5P.Challenge = (function ($, EventDispatcher) {
    function Challenge(instance) {
      EventDispatcher.call(this);

      /** @alias H5P.Challenge **/
      var self = this;

      var countdownInterval;

      // DOM Elements
      var $container = H5P.jQuery('.h5p-content[data-content-id="' + instance.contentId + '"]').get(0);
      var $actions = H5P.jQuery($container).find('.h5p-actions');
      var $challenge = H5P.jQuery('<div class="challenge-container" style="display:none;"></div>');

      /**
       * Translation function, uses H5P.t function with preset domain
       * @param  {string} key  Translation key
       * @param  {object} vars Replacement variables
       * @return {string}
       */
      self.t = function(key, vars) {
        return H5P.t(key, vars, 'OVC');
      };

      /**
      * Helper for creating action bar buttons.
      *
      * @private
      * @param {string} type
      * @param {string} customClass Instead of type class
      */
      var addActionBarButton = function (type, customClass) {
        /**
        * Handles selection of action
        */
        var handler = function () {
          self.trigger(type);
        };
        H5P.jQuery('<li/>', {
          'class': 'h5p-button h5p-noselect h5p-' + (customClass ? customClass : type),
          role: 'button',
          tabindex: 0,
          title: self.t(type + 'Description'),
          html: self.t(type),
          on: {
            click: handler,
            keypress: function (e) {
              if (e.which === 32) {
                handler();
                e.preventDefault(); // (since return false will block other inputs)
              }
            }
          },
          appendTo: $actions
        });
      };

      // Add to action bar and instanciate
      addActionBarButton('challenge');
      $challenge.insertBefore($actions);

      /**
       * Returns instance container element
       * @return {Node} DOM Node
       */
      self.getContainerDOMElement = function() {
        return $container;
      };

      /**
       * Returns challenge actions element
       * @return {Node} DOM Node
       */
      self.getActionsDOMElement = function () {
        return $challenge.find('.challenge-actions');
      };

      /**
       * Returns challenge container element
       * @return {Node} DOM Node
       */
      self.getDOMElement = function() {
        return $challenge;
      };

      /**
       * Returns challenge body element
       * @return {Node} DOM Node
       */
      self.getBodyDOMElement = function() {
        return $challenge.find('.challenge-body');
      };

      /**
       * Disables challenge buttons or ones within some context
       * @param  {Node} $context DOM Element to use a context
       */
      self.disableButtons = function($context) {
        if (!$context) {
          $context = $challenge;
        }

        $context.find('button').prop('disabled', true);
      };

      /**
       * Enables challenge buttons or ones within some context
       * @param  {Node} $context DOM Element to use as a context
       */
      self.enableButtons = function($context) {
        if (!$context) {
          $context = $challenge;
        }
        $context.find('button').prop('disabled', false);
      };

      /**
       * Remove validation class from challenge inputs or ones within some context
       * @param  {Node} $context DOM Element to use as a context
       */
      self.removeValidationClass = function($context) {
        if (!$context) {
          $context = $challenge;
        }
        $context.find('.missing-required-value').removeClass('missing-required-value');
      };

      /**
       * Returns input or select value by name with optional trim
       * @param  {string}  name Element name
       * @param  {boolean} trim Apply trim
       * @return {string}       Input value
       */
      self.getInputValue = function(name, trim, validate) {
        var $element = $challenge.find('input[name="' + name + '"], select[name="' + name + '"]');
        var value = $element.val();

        value = (trim === true) ? value.trim() : value;

        if (validate === true && !value) {
          $element.addClass('missing-required-value');
        }

        return value;
      };

      /**
       * Checks if there is an active challenge running
       * @return {boolean}
       */
      self.isActiveParticipation = function() {
        return !!self.getChallengeUUID();
      };

      /**
       * Returns running challenge UUID
       * @return {mixed} String or null
       */
      self.getChallengeUUID = function() {
        var cookieData = Cookies.getJSON('Drupal.visitor.ov-challenge-for-' + instance.contentId);

        if (cookieData) {
          return cookieData.uuid;
        }

        return null;
      };

      /**
       * Returns challenge info
       * @return {mixed} Object or null
       */
      self.getChallengeInfo = function() {
        var cookieData = Cookies.getJSON('Drupal.visitor.ov-challenge-for-' + instance.contentId);

        if (cookieData) {
          return cookieData.challenge;
        }

        return null;
      };

      /**
       * Checks if the challenge is finished (score stored)
       * @return {boolean} [description]
       */
      self.hasFinishedChallenge = function() {
        var cookieData = Cookies.getJSON('Drupal.visitor.ov-challenge-for-' + instance.contentId);

        if (cookieData) {
          return !!cookieData.finished;
        }

        return false;
      };

      /**
       * Returns security token query string, extracted from H5PIntegration.ajax.setFinished
       * @return {string} Query string with token data
       */
      self.getSecurityTokenQS = function() {
        return H5PIntegration.ajax.setFinished.substring(H5PIntegration.ajax.setFinished.indexOf('?token='));
      };

      /**
       * Extracts reCAPTCHA Site Key data from the URL of a loaded service script
       * @return {string} Site Key or an empty string
       */
      self.getRecaptchaSiteKey = function() {
        var script = H5P.jQuery('script[src^="https://www.google.com/recaptcha/api.js"]');

        if (script.length > 0) {
          var src = script.attr('src');
          var sitekey = src.substring(src.indexOf('sitekey=') + 8);
          if (sitekey.indexOf('&') !== -1) {
            sitekey = sitekey.substring(0, sitekey.indexOf('&'));
          }

          return sitekey;
        }

        return '';
      };

      /**
       * Submits challenge score
       * @param  {int} score    Current score
       * @param  {int} maxScore Maximum score
       * @param  {function} cb  Callback function
       */
      self.setFinished = function(score, maxScore, cb) {
        if (self.isActiveParticipation()) {
          H5P.jQuery.post(H5PIntegration.baseUrl + '/ov-challenge-ajax/set-finished.json' + self.getSecurityTokenQS(), {
            contentId: instance.contentId,
            uuid: self.getChallengeUUID(),
            score: score,
            maxScore: maxScore
          }, function(response) {
            if (!response.success) {
              if (response.message) {
                alert(response.message);
              }
              return;
            } else {
              alert(self.t('successScoreSubmitted'));
            }
          }).fail(function(response) {
            alert(self.t('errorUnknown'));
          }).done(function() {
            if (cb && typeof cb === 'function') {
              cb();
            }
          });
        }
      };

      /**
       * Add visuals for active challenge
       */
      self.addActiveChallengeVisuals = function() {
        if (self.isActiveParticipation()) {
          var challengeInfo = self.getChallengeInfo();
          var $challengeActions = self.getActionsDOMElement();
          var $challengeBody = self.getBodyDOMElement();
          self.disableButtons($challengeActions);
          H5P.jQuery('<div/>', {
            class: 'explanation',
            text: self.t('textChallengeExplanation')
          }).appendTo($challengeBody);
          H5P.jQuery('<div/>', {
            html: self.t('textChallengeTitle', {'@title': '<strong>' + challengeInfo.title + '</strong>'}),
          }).appendTo($challengeBody);
          H5P.jQuery('<div/>', {
            text: self.t('textChallengeStarted', {'@date': new Date(challengeInfo.started * 1000).toLocaleString()}),
          }).appendTo($challengeBody);
          H5P.jQuery('<div/>', {
            html: self.t('textChallengeEnds', {'@timer': '<span class="timer"></span>'}),
          }).appendTo($challengeBody);
          H5P.jQuery('<button/>', {
            class: 'h5p-joubelui-button',
            type: 'button',
            text: self.t('buttonFinish'),
            on: {
              click: function() {
                var finished = self.hasFinishedChallenge();
                var email = prompt(self.t('confirmEndChallenge'), '');

                if (email != null) {
                  if (instance.getScore && typeof instance.getScore === 'function' && instance.getMaxScore && typeof instance.getMaxScore === 'function' && !finished) {
                    self.disableButtons(self.getBodyDOMElement());
                    self.setFinished(instance.getScore(), instance.getMaxScore(), function() {
                      self.trigger('endChallenge', {email: email});
                    });
                  } else {
                    self.trigger('endChallenge', {email: email});
                  }
                }
              }
            }
          }).appendTo($challengeBody);

          // Deal with timer
          var endTime = new Date(challengeInfo.finished * 1000).getTime();
          if ( countdownInterval) {
            clearInterval(countdownInterval);
          }
          countdownInterval = setInterval(function() {
            var now = new Date().getTime();

            var distance = endTime - now;

            if (distance < 0) {
              clearInterval(countdownInterval);
              $challengeBody.find('.timer').html(self.t('challengeExpired'));
            }

            var parts = {
              days: Math.floor(distance / (1000 * 60 * 60 * 24)),
              hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((distance % (1000 * 60)) / 1000)
            };

            var timerHtml = '';
            var showValue = false;
            H5P.jQuery.each(parts, function(key, value) {
              showValue = (showValue || value > 0) ? true : false;
              if (showValue) {
                timerHtml += (value < 10) ? '0' + value : value;
                timerHtml += (key !== 'seconds') ? ':' : '';
              }
            });

            $challengeBody.find('.timer').html(timerHtml);
          }, 1000);
        }
      };

      /**
       * Listens for 'challenge' event and deals with visuals
       */
      self.on('challenge', function() {
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }

        if ($challenge.is(':visible')) {
          $challenge.hide();
          H5P.trigger(instance, 'resize');
          $challenge.html('');
          return;
        }

        $challenge.html('<div class="challenge-header"><label>' + self.t('headerChallenge') + '</label></div><div class="challenge-actions"></div><div class="challenge-body"></div>');

        H5P.jQuery('<button/>', {
          class: 'h5p-joubelui-button',
          type: 'button',
          text: self.t('buttonJoin'),
          on: {
            click: function() {
              self.trigger('joinExistingChallenge');
            }
          }
        }).appendTo(self.getActionsDOMElement());
        H5P.jQuery('<button/>', {
          class: 'h5p-joubelui-button',
          type: 'button',
          text: self.t('buttonCreate'),
          on: {
            click: function() {
              self.trigger('startNewChallenge');
            }
          }
        }).appendTo(self.getActionsDOMElement());

        if (self.isActiveParticipation()) {
          self.addActiveChallengeVisuals();
        }

        $challenge.show();
        H5P.trigger(instance, 'resize');
      });

      /**
       * Listens to 'joinExistingChallenge' event, creates one and deals with visuals
       */
      self.on('joinExistingChallenge', function() {
        if (self.isActiveParticipation()) {
          return;
        }

        var $tmpContainer = H5P.jQuery('<div/>', {
          class: 'join-existing-challenge',
        });
        H5P.jQuery('<div class="row"><label>' + self.t('labelName') + ':</label><input type="text" value="" placeholder="' + self.t('placeholderName') + '" name="participant-name"></div>').appendTo($tmpContainer);
        H5P.jQuery('<div class="row"><label>' + self.t('labelCodeInput') + ':</label><input type="text" value="" placeholder="872762" name="challenge-code"></div>').appendTo($tmpContainer);
        H5P.jQuery('<button/>', {
          class: 'h5p-joubelui-button',
          type: 'button',
          text: self.t('buttonStart'),
          on: {
            click: function() {
              self.disableButtons();
              self.removeValidationClass(self.getBodyDOMElement());
              var participantName = self.getInputValue('participant-name', true, true);
              var challengeCode = self.getInputValue('challenge-code', true, true).replace(/\s/g, ''); // The code could have spaces in it

              if (!(participantName && challengeCode)) {
                self.enableButtons();
                return;
              }

              H5P.jQuery.post(H5PIntegration.baseUrl + '/ov-challenge-ajax/start-playing.json' + self.getSecurityTokenQS(), {
                contentId: instance.contentId,
                name: participantName,
                code: challengeCode
              }, function(response) {
                self.enableButtons();

                if (!response.success) {
                  H5P.trigger(instance, 'resize');
                  if (response.message) {
                    alert(response.message);
                  } else {
                    alert(self.t('errorCouldNotJoinTheChallenge'));
                  }
                  return;
                }

                if (self.isActiveParticipation()) {
                  self.getBodyDOMElement().html('');
                  self.addActiveChallengeVisuals();
                }

                H5P.trigger(instance, 'resize');
              }).fail(function() {
                self.enableButtons();
                H5P.trigger(instance, 'resize');
                alert(self.t('errorUnknown'));
              });
            }
          }
        }).appendTo($tmpContainer);
        self.getBodyDOMElement().html('');
        $tmpContainer.appendTo(self.getBodyDOMElement());
        H5P.trigger(instance, 'resize');
      });

      self.on('startNewChallenge', function() {
        if (self.isActiveParticipation()) {
          return;
        }

        var recaptchaResponse;
        var $tmpContainer = H5P.jQuery('<div/>', {
          class: 'start-new-challenge'
        });
        H5P.jQuery('<div>', {
          class: 'check-hint-text',
          text: self.t('textCheckHint')
        }).appendTo($tmpContainer);
        H5P.jQuery('<div class="row"><label>' + self.t('labelTitle') + ':</label><input type="text" value="" placeholder="' + self.t('placeholderTitle') + '" name="challenge-title"></div>').appendTo($tmpContainer);
        H5P.jQuery('<div class="row"><label>' + self.t('labelTeacherEmail') + ':</label><input type="email" value="" placeholder="' + self.t('placeholderEmail') + '" name="challenge-email"></div>').appendTo($tmpContainer);
        H5P.jQuery('<div class="row"><label>' + self.t('labelChallengeDuration') + ':</label><select name="challenge-duration"><option value="1">' + self.t('optionOneHour') + '</option><option value="2">' + self.t('optionTwoHours') + '</option><option value="24">' + self.t('optionOneDay') + '</option><option value="168">' + self.t('optionOneWeek') + '</option></select></div>').appendTo($tmpContainer);
        H5P.jQuery('<div/>', {
          id: 'recaptcha-' + instance.contentId
        }).appendTo($tmpContainer);
        H5P.jQuery('<button/>', {
          class: 'h5p-joubelui-button',
          type: 'button',
          text: self.t('buttonGenerateCode'),
          on: {
            click: function() {
              self.disableButtons();
              self.removeValidationClass(self.getBodyDOMElement());
              var challengeTitle = self.getInputValue('challenge-title', true, true);
              var challengeEmail = self.getInputValue('challenge-email', true, true);
              var challengeDuration = self.getInputValue('challenge-duration', true, true);

              if (!(challengeTitle && challengeEmail && challengeDuration && recaptchaResponse)) {
                self.enableButtons();
                return;
              }
              H5P.jQuery.post(H5PIntegration.baseUrl + '/ov-challenge-ajax/create-new.json' + self.getSecurityTokenQS(), {
                contentId: instance.contentId,
                title: challengeTitle,
                email: challengeEmail,
                duration: challengeDuration,
                'g-recaptcha-response': recaptchaResponse
              }, function(response) {
                self.enableButtons();

                $challenge.find('.challenge-code').remove();
                $challenge.find('.challenge-results-url').remove();

                if (!response.success) {
                  H5P.trigger(instance, 'resize');
                  if (response.message) {
                    alert(response.message);
                  } else {
                    alert(self.t('errorCouldNotStartNewChallenge'));
                  }
                  return;
                }

                H5P.jQuery('<span/>', {
                  class: 'challenge-code',
                  text: response.data.code.substring(0, response.data.code.length / 2) + ' ' + response.data.code.substring(response.data.code.length / 2)
                }).appendTo($tmpContainer);
                H5P.jQuery('<span/>', {
                  class: 'challenge-results-url',
                  html: self.t('challengeUrl', {'@url': '<a href="' + response.data.url + '" target="_blank">' + response.data.url + '</a>'})
                }).appendTo($tmpContainer);
                H5P.trigger(instance, 'resize');
              }).fail(function() {
                self.enableButtons();
                H5P.trigger(instance, 'resize');
                alert(self.t('errorUnknown'));
              });
            }
          }
        }).appendTo($tmpContainer);
        self.getBodyDOMElement().html('');
        $tmpContainer.appendTo(self.getBodyDOMElement());
        H5P.trigger(instance, 'resize');

        grecaptcha.render('recaptcha-' + instance.contentId, {
          sitekey : self.getRecaptchaSiteKey(),
          callback: function(response) {
            recaptchaResponse = response;
          }
        });
        setTimeout(function() {
          H5P.trigger(instance, 'resize');
        }, 2000);
      });

      self.on('endChallenge', function(e) {
        if (!self.isActiveParticipation()) {
          return;
        }

        var email = (e.data && e.data.email) ? e.data.email.trim() : '';

        // Use chose not to provide an email, no need to assign badges
        if (!email) {
          Cookies.remove('Drupal.visitor.ov-challenge-for-' + instance.contentId);
          if (!self.isActiveParticipation()) {
            self.enableButtons(self.getActionsDOMElement());
            self.getBodyDOMElement().html('');
            H5P.trigger(instance, 'resize');
          }
          if (countdownInterval) {
            clearInterval(countdownInterval);
          }
          return;
        }

        self.disableButtons(self.getBodyDOMElement());
        H5P.jQuery.post(H5PIntegration.baseUrl + '/ov-challenge-ajax/end.json' + self.getSecurityTokenQS(), {
          contentId: instance.contentId,
          uuid: self.getChallengeUUID(),
          email: email,
        }, function(response) {
          self.enableButtons(self.getBodyDOMElement());

          if (!response.success) {
            H5P.trigger(instance, 'resize');
            if (response.message) {
              alert(response.message);
            } else {
              alert(self.t('errorCouldNotEndChallenge'));
            }
            return;
          }

          if (!self.isActiveParticipation()) {
            self.enableButtons(self.getActionsDOMElement());
            self.getBodyDOMElement().html('');
            if (response.data && response.data.badge) {
              var $badge = H5P.jQuery('<div/>', {
                'class': 'challenge-badge'
              });
              H5P.jQuery('<a/>', {
                href: 'http://backpack.openbadges.org/baker?assertion=' + response.data.assertionUrl,
                class: 'badge-image',
                title: self.t('challengeBadgeImageTitle'),
                target: '_blank',
              }).appendTo($badge);
              H5P.jQuery('<img/>', {
                src: response.data.badge.image,
                alt: 'badge-image',
              }).appendTo($badge.find('.badge-image'));
              H5P.jQuery('<div/>', {
                class: 'badge-content'
              }).appendTo($badge);
              H5P.jQuery('<h4/>', {
                class: 'badge-title',
                text: response.data.badge.name,
              }).appendTo($badge.find('.badge-content'));
              H5P.jQuery('<p/>', {
                class: 'badge-description',
                text: response.data.badge.description
              }).appendTo($badge.find('.badge-content'));
              H5P.jQuery('<a/>', {
                href: response.data.assertionUrl,
                class: 'badge-assertion',
                text: self.t('challengeBadgeAssertionUrl'),
                target: '_blank'
              }).appendTo($badge.find('.badge-content'));
              $badge.appendTo(self.getBodyDOMElement());
            }
            H5P.trigger(instance, 'resize');
            setTimeout(function() {
              H5P.trigger(instance, 'resize');
            }, 500);
          }
          if (countdownInterval) {
            clearInterval(countdownInterval);
          }
        }).fail(function() {
          self.enableButtons(self.getBodyDOMElement());
          H5P.trigger(instance, 'resize');
          alert(self.t('errorUnknown'));
        });
      });

      H5P.on(instance, 'finish', function (event) {
        if (event.data !== undefined) {
          // This check is taken from the H5P core implementation, just in case that matters
          var validScore = typeof score === 'number' || score instanceof Number;
          if (validScore) {
            self.setFinished(event.data.score, event.data.maxScore);
          }
        }
      });

      H5P.on(instance, 'xAPI', function(event) {
        if ((event.getVerb() === 'completed' || event.getVerb() === 'answered') && !event.getVerifiedStatementValue(['context', 'contextActivities', 'parent']) && self.isActiveParticipation()) {
          var score = event.getScore();
          var maxScore = event.getMaxScore();
          var contentId = event.getVerifiedStatementValue(['object', 'definition', 'extensions', 'http://h5p.org/x-api/h5p-local-content-id']);

          // XXX This might be unneeded as the xAPI events are checked upon instance itself
          if (instance.contentId != contentId) {
            return;
          }

          self.setFinished(score, maxScore);
        }
      });
    }

    Challenge.prototype = Object.create(EventDispatcher.prototype);
    Challenge.prototype.constructor = Challenge;

    return Challenge;

  })(H5P.jQuery, H5P.EventDispatcher);

  H5P.jQuery('document').ready(function() {
    if (H5PIntegration) {
      H5PIntegration.l10n.OVC = {
        challenge: 'Teadmistekontroll',
        challengeDescription: 'Loo uus või osale käimasolevas.',
        headerChallenge: 'Teadmiste kontroll',
        buttonJoin: 'Liitu (õpilane)',
        buttonCreate: 'Loo (õpetaja)',
        buttonGenerateCode: 'Genereeri kood',
        buttonStart: 'Alusta',
        buttonFinish: 'Lõpeta',
        labelTitle: 'Pealkiri',
        labelTeacherEmail: 'Õpetaja e-post',
        labelChallengeDuration: 'Kontrolli kehtivus',
        labelName: 'Nimi',
        labelCodeInput: 'Sisesta kood',
        placeholderName: 'Nimi',
        placeholderTitle: 'Pealkiri',
        placeholderEmail: 'mari.maasikas@koolinimi.edu.ee',
        optionOneHour: 'Üks tund',
        optionTwoHours: 'Kaks tundi',
        optionOneDay: 'Üks päev',
        optionOneWeek: 'Üks nädal',
        textChallengeExplanation: 'NB! Teadmistekontrolli vastused edastatakse automaatselt õpetajale peale seda, kui Sa oled vastanud kõigile küsimustele.',
        textChallengeTitle: 'Teadmiste kontroll: @title',
        textChallengeStarted: 'Teadmiste kontroll alanud: @date',
        textChallengeEnds: 'Teadmiste kontrolli lõpuni: @timer',
        confirmEndChallenge: 'Kilkatas nupul "Lõpeta", loetakse Teadmistekontroll lõppenuks. Kui sa ei ole kõiki ülesandeid eelnevalt lõpetanud, ei saadeta Sinu tulemusi õpetajale.\nNB! Sisestades e-posti aadressi, avanab võimalus Õpimärgi saamiseks. Jäta antud väli tühjaks kui sa seda ei soovi.',
        challengeBadgeImageTitle: 'Lae alla Õpimärgi pilt, mille sees paikneb ka saavutuse kinnitus.',
        challengeBadgeAssertionUrl: 'Vajuta Õpimärgi pilti et laadida see alla, pildi sees paikneb ka saavutuse kinnitus. Või vajuta siia et avada iseseisev kinnitus uues aknas.',
        errorCouldNotJoinTheChallenge: 'Midagi läks valesti! Ei saanud väljakutsega liituda.',
        errorCouldNotStartNewChallenge: 'Midagi läks valesti! Ei saanud uut väljakutset luua.',
        errorCouldNotEndChallenge: 'Midagi lälks valesti! Ei saanud väljakutset lõpetada.',
        errorUnknown: 'Teenuse viga! Palun proovi uuesti või võta ühendust administraatoriga.',
        successScoreSubmitted: 'Oled edukalt väljakutset lõpetanud. Nüüd saad kas proovida veel või vajutada lõpetamise nuppu.',
        challengeUrl: 'Viide tulemustele: @url',
        textCheckHint: 'Palume alati eelnevalt kontrollida, kas antud materjali puhul Teadmistekontroll oskab sooritajale tulemusi salvestada ja saata. Kontrollimiseks läbige Teadmistekontroll.'
      };
    }
    if (H5P.instances && H5P.instances.length > 0) {
      H5P.jQuery.each(H5P.instances, function(index, instance) {
        var challenge = new H5P.Challenge(instance);
      });
    }
  });
})();
