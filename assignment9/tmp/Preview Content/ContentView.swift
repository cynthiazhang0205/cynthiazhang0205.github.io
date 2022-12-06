//
//  ContentView.swift
//  hw
//
//  Created by Jianlgi on 11/27/22.
//

import SwiftUI



struct Business:View, Hashable {
    var index = 0
    var img: String
    var Name: String
    var rating = 5.0
    var distance = 0
    var id = ""
    var body: some View {
//        Divider()
            HStack{
                Text(index.formatted()).bold()
                AsyncImage(url: URL(string: img)){ image in
                    image.resizable()
                } placeholder: {
                    ProgressView()
                }.frame(width: 50, height: 50).clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                Text(Name).fixedSize(horizontal: false, vertical: true).frame(maxWidth: 150).foregroundColor(.gray)
                Spacer()
                Text(rating.formatted()).bold()
                Spacer()
                Text(distance.formatted()).bold()
                Image(systemName: "chevron.right").foregroundColor(.gray).bold().font(.system(size: 10))
            }
        }
}

struct ContentView: View {
    @State var keyword: String = "";
    @State var distance: String = "10";
    @State var category: String = "all";
    @State var location: String = "";
    @State var auto: Bool = false;
    @State var valid: Bool = false;
    @State var autocomplete = [String]();
    @State var completing = false;
    @State var loadingC = true;
    @State var loadingR = false;
    @State var businesses:[Business] = [];
    @State var submitted = false;
    @State var selection: Business?;
    @State var businessDetailActive = false;
    @State var viewReservations = false;
    var body: some View {
        NavigationView {
            Form{
                // search section
                Section {
                    HStack{
                        Text("Keyword:").foregroundColor(.gray)
                        TextField(text: $keyword, prompt: Text("Required")) {}
                            .onChange(of: keyword) { value in
                                self.checkValid()
                            }
                            .onSubmit {
                                if keyword == "" {
                                    return
                                }
                                loadingC = true
                                completing = true
                                self.autocomplete = []
                                self.fetchAutocomplete()
                            }
                            .alwaysPopover(isPresented: $completing) {
                                VStack{
                                    if loadingC{
                                        ProgressView("Loading").padding(20).frame(width: 400)
                                    }
                                    ForEach(autocomplete, id: \.self) { value in
                                        Button(action: {
                                            selectComplete(cur: value)
                                        }) {Text(value)}.foregroundColor(.gray).padding(5)
                                    }
                                }.frame(minWidth: 300)
                            }
                    }
                    HStack{
                        Text("Distance:").foregroundColor(.gray)
                        TextField(text: $distance, prompt: Text("Required")) {  }.keyboardType(.decimalPad)
                    }
                    
                    HStack{
                        Text("Category:").foregroundColor(.gray)
                        Picker("", selection: $category, content: {
                            Text("Defaults").tag("all")
                            Text("Arts and Entertainment").tag("arts")
                            Text("Health and Medical").tag("health")
                            Text("Hotels and Travel").tag("hotelstravel")
                            Text("Food").tag("food")
                            Text("Professional Services").tag("professional")
                        }).pickerStyle(.menu)

                    }
                    if !auto{
                        HStack{
                            Text("Location:").foregroundColor(.gray)
                            TextField(text: $location, prompt: Text("Required")) {  }
                        }.onChange(of: location) { value in
                            self.checkValid()
                        }
                    }
                    
                    HStack{
                        Text("Auto-detect my location").foregroundColor(.gray)
                        Toggle(isOn: $auto) {}
                            .onChange(of: auto) { value in
                                if value {
                                    location = ""
                                }
                                self.checkValid()
                            }
                    }
                    HStack{
                        Spacer()
                        if valid{
                            Button(action: {
                                self.fetchResults()
                            }) {Text("Submit")}
                                .padding(20).buttonStyle(PlainButtonStyle()).background(.red).foregroundColor(.white).clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                        } else {
                            Button(action: {
                            }) {Text("Submit")}
                                .padding(20).buttonStyle(PlainButtonStyle()).background(.gray).foregroundColor(.white).clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                        }
                        
                        Button(action: {
                            keyword = ""
                            distance = "10"
                            auto = false
                            location = ""
                            category = "all"
                            submitted = false
                            loadingR = false
                            loadingC = false
                            businesses = []
                        }) {Text("Clear")}
                            .padding(20)
                            .buttonStyle(PlainButtonStyle()).background(.blue).clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous)).foregroundColor(.white)
                        Spacer()
                    }.padding(10)
                    
                    
                }
                // results section
                Section{
                    HStack{
                        Text("Results").bold().font(.system(size: 26))
                        Spacer()
                    }
                    if loadingR {
                        ProgressView("Please wait...")
                    }
                    if submitted && businesses.count == 0 {
                        Text("No result available").foregroundColor(.red)
                    }
                    List(businesses, id: \.self, selection: $selection) { business in
//                        Divider()
                        Button (
                            action:{
                                selection = business
                                businessDetailActive = true
                            }
                            , label: {
                                business
                            }
                        )
                        .foregroundColor(.black).buttonStyle(BorderlessButtonStyle())
                            
                    }
                    NavigationLink(destination: BusinessDetail(business: $selection), isActive: $businessDetailActive) {}.hidden().frame(height: 0)
                }
                
                //
                .navigationTitle("Buissness search")
                
                .navigationBarItems(trailing:
                    NavigationLink( destination: reservations()) {
                        Image(systemName: "calendar.badge.clock")
                    }
                )
               
                
//
            }
        }
    }
    
    func checkValid() {
        var v = true
        if keyword == "" {
            v = false
        }
        if location == "" && !auto {
            v = false
        }
        self.valid = v
    }
    
    func fetchAutocomplete() {
        guard let url = URL(string: "https://hw8-nodejs-runtime.uw.r.appspot.com/autocomplete?text=" + self.keyword.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!) else {
                print("Invalid URL")
                return
            }
            let request = URLRequest(url: url)

            URLSession.shared.dataTask(with: request) { data, response, error in
                if let data = data {
                    if let response = try? JSONDecoder().decode([String].self, from: data) {
                        DispatchQueue.main.async {
                            self.autocomplete = response
                            self.loadingC = false
                            print(response)
                        }
                        return
                    }
                }
            }.resume()
        }
    
    func fetchResults() {
        loadingR = true
        submitted = false
        guard let url = URL(string: "https://hw8-nodejs-runtime.uw.r.appspot.com/business?term=" + self.keyword.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
                            + "&radius=" + self.distance
                            + "&categories=" + self.category
                            + "&location=" + self.location.addingPercentEncoding(withAllowedCharacters: .urlHostAllowed)!
        )
            else {
                print("Invalid URL")
                return
            }
        self.businesses.removeAll()
            let request = URLRequest(url: url)

            URLSession.shared.dataTask(with: request) { data, response, error in
                if let data = data {
                    let json = try?JSON(data: data)
                    for (index, business):(String, JSON) in json!["businesses"] {
                        print(index )
                        self.businesses.append(Business(
                            index: Int(index)! + 1,
                            img: business["image_url"].string!, Name: business["name"].string!,
                            rating: business["rating"].double!, distance: Int(business["distance"].double! * 0.000621371) + 1,
                            id: business["id"].string!
                        ))
                    }
                    loadingR = false
                    submitted = true
//                    print(json?["businesses"])
//                    print(json!["businesses"] as? )
                }
            }.resume()
    }
    
    func selectComplete(cur: String) {
        completing = false
        keyword = cur
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}

