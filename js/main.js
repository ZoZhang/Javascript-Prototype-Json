/**
 * Travail individuel pour langage web - Monsieur Olivier Gérard
 *
 * Main functions frontend
 *
 * @author ZHANG Zhao
 * @email  zo.zhang@gmail.com
 * @demo   langage-web.zhaozhang.fr
 */
;(function($){

    var RFC = {
        Parames: {},
        // create ZoEngine instance.
        Initialize: function() {
            // Loading Page Data by json file.
            RFC.getData('js/data.json');

            // Set Messages
            RFC.Parames.Message = {
                fr:{
                    errors:{
                        empty_keyword:"Vous devez taper le mot-clés, s'il vous plait."
                    },
                    warning:{
                        empty_resultat:"Désole, il n'y a aucne article."
                    }
                }
            };

            // Set Element Names
            RFC.Parames.MainPage = 'main';
            RFC.Parames.HomePage = 'main section:first-child';
            RFC.Parames.ViewPage = 'main section:last-child';
            RFC.Parames.OtherPage = 'main section:not(:first-child)';
            RFC.Parames.FooterForm = 'main section:first-child > footer';
            RFC.Parames.Form = 'main section:first-child > footer > form';
            RFC.Parames.FormInput = 'main section:first-child > footer > form > input';
            RFC.Parames.FormButton = 'main section:first-child > footer > form > button';
            RFC.Parames.FormSuggestion = 'main section:first-child > footer > div';
            RFC.Parames.FormSuggestionLinks = 'main section:first-child > footer > div ul li  a';

        },
        Run: function() {

            // Init Data etc.
            RFC.Initialize();

            // Init Search Form
            $(RFC.Parames.Form).addEvent('submit', RFC.eventSearch);

            // Init Focus Events.
            $(RFC.Parames.FormInput).addEvent('focus', RFC.eventFocus);
            //$(RFC.Parames.FormInput).addEvent('blur', RFC.eventBlur);

        },
        getData: function(file) {

            $('body').Ajax(file, function(request){

                // request success
                if (200 === request.status ) {
                    RFC.Parames.SearchData = JSON.parse(request.responseText);
                 } else {
                    // request exception
                }
            });
        },
        eventFocus: function(event) {
            this.value = '';
            this.className = '';
            RFC.setSugestion(RFC.Parames.FooterForm);
        },
        eventBlur: function() {
            RFC.setSugestion(false);
        },
        eventSearch: function(event) {

            event.preventDefault();

            RFC.Parames.SearchKeyWord = $(RFC.Parames.FormInput).val();

            if (0 === RFC.Parames.SearchKeyWord.length) {
                $(RFC.Parames.FormInput).val(RFC.Parames.Message.fr.errors.empty_keyword).addClass('required-keyword');
                return false;
            }

            if (!RFC.searchKeyword()) {
                $(RFC.Parames.FormInput).val(RFC.Parames.Message.fr.warning.empty_resultat).addClass('empty-resultat');
                return false;
            }

            RFC.viewRFC();

            return false;
        },
        eventLinks: function(event) {

            RFC.Parames.SearchKeyWord = event.toElement.name;

            if (!RFC.searchKeyword()) {
                $(RFC.Parames.FormInput).val(RFC.Parames.Message.fr.warning.empty_resultat).addClass('empty-resultat');
                return false;
            }

            RFC.viewRFC();

            return false;
        },
        searchKeyword: function() {
            var searchKeyWord = RFC.Parames.SearchKeyWord.toUpperCase();
            RFC.Parames.SearchData.forEach(function(element){
                if (searchKeyWord === element.keyword.toUpperCase() || element.title.toUpperCase().indexOf(searchKeyWord) >= 0) {
                    RFC.Parames.SearchContenue = element;
                    return true;
                }
            });

            if ('undefined' === RFC.Parames.SearchContenue) {
                return false;
            }
            return true;
        },
        viewRFC: function() {
            // hidden home page
            $(RFC.Parames.MainPage).removeClass('home-page').addClass('view-page');

            if (!(null === $(RFC.Parames.OtherPage).elements)) {
                $(RFC.Parames.OtherPage).remove();
            }

            // Add sugestion list
            RFC.setSugestion(RFC.Parames.FooterForm);

            var templage = '<section>';

            templage += '<article><header><h1>' + RFC.Parames.SearchContenue.title + '</h1>' +
                '<p><span>'+RFC.Parames.SearchContenue.publish_date+'</span><span>'+RFC.Parames.SearchContenue.author+'</span></p></header>';

            templage += '<footer>';

            RFC.Parames.SearchContenue.content.forEach(function(element) {

                templage += '<p><strong>' + element.subtitle + '</strong></p>';

                templage += '<p>' + element.text + '</p>';
            });

            templage += '</footer>';

            templage += '<address>' + RFC.Parames.SearchContenue.contacts.adresse;

            if (RFC.Parames.SearchContenue.contacts.email) {
                templage += '<p>Email: <a href="mailto:' + RFC.Parames.SearchContenue.contacts.email + '">' + RFC.Parames.SearchContenue.contacts.email +'</a></p>';
            }

            if (RFC.Parames.SearchContenue.contacts.telephone) {
                templage += '<p>Phone: <a href="tel:' + RFC.Parames.SearchContenue.contacts.Phone + '">' + RFC.Parames.SearchContenue.contacts.Phone +'</a></p>';
            }

            if (RFC.Parames.SearchContenue.contacts.url) {
                templage += '<p>Site: <a href="' + RFC.Parames.SearchContenue.contacts.url + '">' + RFC.Parames.SearchContenue.contacts.url +'</a></p>';
            }

            templage += '</address></article>';

            templage += '</section>';

            $(RFC.Parames.MainPage).append(templage);

        },
        setSugestion: function(element) {

            if (!(null === $(RFC.Parames.FormSuggestion).elements)) {
                $(RFC.Parames.FormSuggestion).remove();
            }

            var templage = '<div><ul>';

            RFC.Parames.SearchData.forEach(function(element){
                templage += '<li><a href="javascript:void(0);" name="'+element.keyword+'">' + element.title + '</a></li>';
            })

            templage += '</ul></div>';

            $(element).append(templage);

            var links = $(RFC.Parames.FormSuggestionLinks, true);
            if (links.elements.length) {
                links.elements.forEach(function(element){
                    element.addEventListener('click', RFC.eventLinks);
                });
            }
        }
    };

    RFC.Run();

})(ZoEngine);